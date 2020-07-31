const mongoose = require('mongoose')

const Pack = new mongoose.Schema(
	{
		version: { type: String, required: true },
		path: { type: String, required: true },
		status: { type: Number, required: true },
		getDate: Date,
		buildVersion: { type: Number },
		buildId: { type: Number },
		errorMessage: { type: String }
	}, {
		timestamps: true,
		toObject: { virtuals: true },
		toJSON: { virtuals: true },
	}
)

module.exports = mongoose.model("Pack", Pack)