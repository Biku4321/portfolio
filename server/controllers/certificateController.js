import Certificate from '../models/Certificate.js';

export const getCertificates = async (req, res) => {
  const data = await Certificate.find();
  res.json(data);
};

export const addCertificate = async (req, res) => {
  const cert = new Certificate(req.body);
  await cert.save();
  res.json(cert);
};

export const addCertificatesBulk = async (req, res) => {
  try {
    const { certificates } = req.body;
    if (!Array.isArray(certificates) || certificates.length === 0) {
      return res.status(400).json({ success:false, message: 'No certificates provided' });
    }
    const docs = await Certificate.insertMany(certificates.map(c => ({ ...c })));
    return res.status(201).json({ success:true, data: docs });
  } catch (err) {
    console.error('addCertificatesBulk error', err);
    return res.status(500).json({ success:false, message: 'Bulk insert failed' });
  }
};

export const updateCertificate = async (req, res) => {
  const cert = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cert);
};

export const deleteCertificate = async (req, res) => {
  await Certificate.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};
