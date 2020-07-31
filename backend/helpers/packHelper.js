const Pack = require('../models/pack');

class PackHelper {
    statusEnum = {
        NAO_PUBLICADO: 0,
        FILA: 1,
        PROCESSANDO: 2,
        DISPONIVEL: 3,
        ERRO: 4
    };

    convertPack(pack) {
        return {
            id: pack._id,
            version: pack.version,
            path: pack.path,
            status: pack.status,
            date: pack.getDate,
            errorMessage: pack.errorMessage
        }
    }

    async updatePack(pack, values, io) {
        await Pack.updateOne({ "_id": pack._id }, values);
    
        //const pack = { ...pack, ...values };//entender pq isso nao funciona
    
        if (values.status) pack.status = values.status;
        if (values.getDate) pack.getDate = values.getDate;
        if (values.errorMessage) pack.errorMessage = values.errorMessage;
        if (values.buildVersion) pack.buildVersion = values.buildVersion;
    
        io.emit("updatePack", this.convertPack(pack));
    }
}

module.exports = new PackHelper();