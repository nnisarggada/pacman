import fs from "fs";
import path from "path";
import secrets from "@/data/secrets";

const updateContact = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const secretHeader = req.headers["secret"];
  const secretKey = secrets.password;
  if (secretHeader !== secretKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { index, name, phone, email } = req.body;

  // Set the file path
  const filePath = path.join(process.cwd(), "data", "contacts.vcf");

  try {
    let existingContacts = fs.readFileSync(filePath, "utf-8");

    let lines = existingContacts.split("\n");

    lines[index + 1] = "FN:" + name;
    lines[index + 2] = "TEL:" + phone;
    lines[index + 3] = "EMAIL:" + email;

    const updatedContacts = lines.join("\n");

    // Write the sorted contacts back to the file
    fs.writeFileSync(filePath, updatedContacts);

    res.status(200).json({ message: "Contact Updated!" });
  } catch (error) {
    res.status(500).json({ error: "Failed!" });
  }
};

export default updateContact;
