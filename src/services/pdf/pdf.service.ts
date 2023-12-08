import pdf from 'pdfjs';
import fs from 'fs';
import * as path from 'path';


class PdfService {
  async create(firstName: string, lastName: string, imagePath: string) {
    const doc = new pdf.Document();
    const table = doc.table({
      widths: [200, 200],
      borderWidth: 1,
    });
    const row = table.row();
    row.cell(`${firstName}`);
    row.cell(`${lastName}`);
    const filePath = path.resolve(__dirname, '../../../src', 'static');
    const img = new pdf.Image(fs.readFileSync(`${filePath}/${imagePath}`));
    doc.image(img, {
      height: 55,
      align: 'center',
    });

    return await doc.asBuffer();
  }
}
module.exports = new PdfService();
