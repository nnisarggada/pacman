package main

import (
	"encoding/base64"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"regexp"
	"strings"

	"github.com/glebarez/sqlite"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

const (
	port     = 8080
	username = "username"
	password = "password"
	dbFile   = "database/contacts.db"
	vcfFile  = "contacts.vcf"
)

type Contact struct {
	gorm.Model
	UUID  string
	Name  string
	Phone string
	Email string
}

func (c Contact) String() string {
	return fmt.Sprintf("UUID: %s, Name: %s, Phone: %s, Email: %s", c.UUID, c.Name, c.Phone, c.Email)
}

var db, err = gorm.Open(sqlite.Open(dbFile), &gorm.Config{})
var contactTemplate *template.Template

func basicAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" {
			w.Header().Set("WWW-Authenticate", `Basic realm="Restricted"`)
			http.Error(w, "Authorization required", http.StatusUnauthorized)
			return
		}

		payload, err := base64.StdEncoding.DecodeString(strings.TrimPrefix(auth, "Basic "))
		if err != nil {
			http.Error(w, "Invalid Authorization", http.StatusUnauthorized)
			return
		}
		pair := strings.SplitN(string(payload), ":", 2)

		if len(pair) != 2 || pair[0] != username || pair[1] != password {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	}
}

func main() {
	db.AutoMigrate(&Contact{})

	contactTemplate = template.Must(template.ParseFiles("templates/fragments/contact-li.html"))

	http.HandleFunc("/", basicAuth(indexHandler))
	http.HandleFunc("/list-contacts", basicAuth(listContactsHandler))
	http.HandleFunc("/export", basicAuth(exportHandler))

	fmt.Printf("Starting server on port %d\n", port)
	http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
}

func addContact(name string, phone string, email string) (Contact, error) {

	if name == "" {
		return Contact{}, fmt.Errorf("Name cannot be empty")
	}

	if phone == "" {
		return Contact{}, fmt.Errorf("Phone cannot be empty")
	}

	phoneRegex := regexp.MustCompile(`^\+[1-9]\d{1,14}$`)
	if !phoneRegex.MatchString(phone) {
		return Contact{}, fmt.Errorf("Invalid phone number format")
	}

	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if email != "" && !emailRegex.MatchString(email) {
		return Contact{}, fmt.Errorf("Invalid email address")
	}

	if err := db.Where("phone = ?", phone).First(&Contact{}).Error; err == nil {
		return Contact{}, fmt.Errorf("Phone number already exists")
	}

	newContact := Contact{UUID: uuid.New().String(), Name: name, Phone: phone, Email: email}

	if err := db.Create(&newContact).Error; err != nil {
		return Contact{}, fmt.Errorf("Failed to add contact: %v", err)
	}

	return newContact, nil
}

func getAllContacts() ([]Contact, error) {
	var contacts []Contact
	if err := db.Find(&contacts).Error; err != nil {
		return nil, fmt.Errorf("Failed to get contacts: %v", err)
	}
	return contacts, nil
}

func exportContacts() error {
	contacts, err := getAllContacts()
	if err != nil {
		return err
	}

	file, err := os.Create(vcfFile)
	if err != nil {
		return err
	}
	defer file.Close()

	for _, contact := range contacts {
		vcf := generateVCard(contact)
		_, err := file.WriteString(vcf)
		if err != nil {
			return err
		}
	}
	return nil
}

func generateVCard(contact Contact) string {
	vCard := fmt.Sprintf(
		"BEGIN:VCARD\nVERSION:3.0\nFN:%s\nTEL:%s\n",
		contact.Name, contact.Phone)

	if contact.Email != "" {
		vCard += fmt.Sprintf("EMAIL:%s\n", contact.Email)
	}

	vCard += "END:VCARD\n"
	return vCard
}

func deleteContact(id string) error {
	if err := db.Where("uuid = ?", id).Delete(&Contact{}).Error; err != nil {
		return fmt.Errorf("Failed to delete contact: %v", err)
	}
	return nil
}

func updateContact(id string, name string, phone string, email string) error {
	if name == "" {
		return fmt.Errorf("Name cannot be empty")
	}

	if phone == "" {
		return fmt.Errorf("Phone cannot be empty")
	}

	phoneRegex := regexp.MustCompile(`^\+[1-9]\d{1,14}$`)
	if !phoneRegex.MatchString(phone) {
		return fmt.Errorf("Invalid phone number format")
	}

	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	if email != "" && !emailRegex.MatchString(email) {
		return fmt.Errorf("Invalid email address")
	}

	if err := db.Model(&Contact{}).Where("uuid = ?", id).Updates(Contact{Name: name, Phone: phone, Email: email}).Error; err != nil {
		return fmt.Errorf("Failed to update contact: %v", err)
	}
	return nil
}

func exportHandler(w http.ResponseWriter, r *http.Request) {
	err := exportContacts()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Failed to export contacts: %v", err)
		return
	}

	file, err := os.Open(vcfFile)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Failed to open vcf file: %v", err)
		return
	}
	defer file.Close()

	w.Header().Set("Content-Disposition", "attachment; filename=contacts.vcf")
	w.Header().Set("Content-Type", "text/vcard")

	http.ServeFile(w, r, vcfFile)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("templates/index.html")
	if err != nil {
		http.Error(w, "Failed to load page", http.StatusInternalServerError)
		return
	}
	tmpl.Execute(w, nil)
}

func listContactsHandler(w http.ResponseWriter, r *http.Request) {
	contacts, err := getAllContacts()
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to load contacts: %v", err), http.StatusInternalServerError)
		return
	}

	for _, contact := range contacts {
		if err := contactTemplate.Execute(w, contact); err != nil {
			http.Error(w, fmt.Sprintf("Failed to render contact: %v", err), http.StatusInternalServerError)
			return
		}
	}
}
