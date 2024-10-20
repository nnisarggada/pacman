# PACMAN - Private Alternative for Contact Management And Networking

**PACMAN** is a free, open-source, web-based contact management app designed for individuals who value simplicity and privacy. PACMAN enables you to securely manage your contacts with essential features like contact creation, editing, deletion, and export to VCF format for easy sharing. The app uses browser-based **Basic Authentication** to protect access to your contact list.

---

# Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the App](#running-the-app)
- [Usage](#usage)
  - [Add, Edit, and Delete Contacts](#add-edit-and-delete-contacts)
  - [Search Contacts](#search-contacts)
  - [Export Contacts to VCF](#export-contacts-to-vcf)
- [TODO](#todo)
- [License](#license)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)

---

## Features

- **Add, Edit, and Delete Contacts**: Easily manage your contacts with a clean, user-friendly interface.
- **Search**: Quickly search through your contacts by name, phone, or email.
- **Export to VCF**: Export individual contacts to the industry-standard `.vcf` format for easy backup and sharing.
- **Basic Authentication**: Protect your contacts using simple browser-based Basic Auth to ensure privacy.
- **Lightweight and Simple**: PACMAN is designed to be easy to use without unnecessary features.

---

## Getting Started

Follow these steps to set up and run PACMAN on your server or local environment.

### Prerequisites

- Go (Golang) installed on your system

### Installation

1. **Clone the PACMAN repository**:

   ```bash
   git clone https://github.com/nnisarggada/pacman
   cd pacman
   ```

2. **Build and Run**:

   ```bash
   go run main.go
   ```

   By default, the app will be accessible at `http://localhost:8080`.

### Configuration

PACMAN has minimal configuration and just uses variables. Here are the configurable variables that can be changed in `main.go`:

```bash
const (
	port     = 8080                       # Port to run the app on
	username = "username"                 # Username for Basic Auth
	password = "password"                 # Password for Basic Auth
	dbFile   = "database/contacts.db"     # SQLite database file
	vcfFile  = "contacts.vcf"             # VCF file to export contacts to
)
```

### Running the App

Run the app using:

```bash
go run main.go
```

The app will now be accessible at `http://localhost:8080`.

---

## Usage

### Add, Edit, and Delete Contacts

1. **Add Contacts**: Navigate to the "Add Contact" page and fill in the contact's details (name, phone, email).
2. **Edit Contacts**: Select a contact from the list and modify the details as needed.
3. **Delete Contacts**: Remove unwanted contacts with a single click.

### Search Contacts

Use the search bar to find contacts by their name, phone number, or email address.

### Export Contacts to VCF

Click on the export button next to any contact to download that contact as a `.vcf` file for easy sharing or backup.

---

## TODO

- [ ] Implement group management for contacts.
- [ ] Add support for importing contacts from `.vcf` files.
- [ ] Improve authentication and security.

---

## License

This project is licensed under the GNU General Public License v3 - see the [LICENSE](LICENSE.md) file for details.

---

## Contributing

We welcome contributions from the community! Please read our [Contribution Guidelines](CONTRIBUTING.md) to get started.

---

## Code of Conduct

Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) to ensure a welcoming and respectful environment for all contributors and users.

---

**Start managing your contacts privately and securely with PACMAN today!**
