import fs from "fs";
import path from "path";
import secrets from "@/data/secrets";

const deleteContact = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const secretHeader = req.headers["secret"];
  const secretKey = secrets.password;
  if (secretHeader !== secretKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { index } = req.body;

  const filePath = path.join(process.cwd(), "data", "contacts.vcf");

  try {
    let existingContacts = fs.readFileSync(filePath, "utf-8");

    let lines = existingContacts.split("\n");

    lines.splice(index, 5);

    const updatedContacts = lines.join("\n");

    fs.writeFileSync(filePath, updatedContacts);

    res.status(200).json({ message: "Contact Deleted!" });
  } catch (error) {
    res.status(500).json({ error: "Failed!" });
  }
};

export default deleteContact;
