import fs from "fs";
import path from "path";
import secrets from "@/data/secrets";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const secretHeader = req.headers["secret"];
  const secretKey = secrets.password;
  if (secretHeader !== secretKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const filePath = path.join(process.cwd(), "data/contacts.vcf");
  const vcfData = fs.readFileSync(filePath, "utf-8");
  res.setHeader("Content-Type", "text/vcard");
  res.setHeader("Content-Disposition", 'attachment; filename="contacts.vcf"');
  res.status(200).send(vcfData);
}
