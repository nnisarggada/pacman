package main

import (
	"fmt"
	"net/http"
	"os"
	"regexp"

	"github.com/glebarez/sqlite"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

const (
	port     = 8080
	password = "password"
	dbFile   = "contacts.db"
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

func main() {
	db.AutoMigrate(&Contact{})
	http.HandleFunc("/export", handleExport)

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

func handleExport(w http.ResponseWriter, r *http.Request) {
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
