const GROUP_SCHEMA = {
    "type": "object",
    "required": [
        'id',
        'name',
        'closeTimeout',
        'matches',   
    ],
    "properties": {
        "id": {
            "type": "string",
        },
        "name": {
            "type": "string",
        },
        "closeTimeout": {
            "type": "number",
        },
        "matches": {
            "type": "array",
            "items": {
                "type": "string",
            }
        },
    },
};

export const EXPORT_SCHEMA_V1 = {
    "id": '/ExportDataVersion1',
    "type": "object",
    "required": [
        'version',
        'data',  
    ],
    "properties": {
        "version": {
            "type": "string",
        },
        "data": {
            "type": "object",
            "required": [
                'groups',   
            ],
            "properties": {
                "groups": {
                    "type": "array",
                    "items": GROUP_SCHEMA,
                }
            },
        },
    }
}