const mongoose = require('mongoose');

// Tax payer schema
const taxpayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOfBirth: Date,
    occupation: String,
    gender: String,
    phoneNumber: String,
    emailAddress: String,
    expectedAnnualIncome: Number,
    tin: { type: String, required: true },
});

// Asset schema
const assetSchema = new mongoose.Schema({
    assetName: { type: String, required: true },
  estimatedCost: { type: Number, required: true },
  ownerTIN: { type: String, required: true },
  type: String,
  assetNumber: String,
});

// Income tax schema
const incomeTaxSchema = new mongoose.Schema({
    tin: { type: String, required: true },
    totalProfits: { type: Number, required: true },
    taxPayable: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now }

    
});

// Models
const TaxPayerModel = mongoose.model('TaxPayer', taxpayerSchema);
const AssetModel = mongoose.model('Asset', assetSchema);
const IncomeTaxModel = mongoose.model('IncomeTax', incomeTaxSchema);

module.exports = { TaxPayerModel, AssetModel, IncomeTaxModel };