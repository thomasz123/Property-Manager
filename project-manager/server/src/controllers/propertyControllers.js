export function getProperty(req, res) {
    res.json({message : "Property info received!"});
}

export function deleteProperty(req, res){
    res.json({message : "Property deleted!"});
}


export function updateProperty(req, res) {
    res.json({message : "Property info updated!"});
}


export function addProperty(req, res) {
    
    res.json({message : "New property added!"});
}
