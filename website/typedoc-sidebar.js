module.exports = [
  "api/index",
  "api/modules",
  {
    "type": "category",
    "label": "Modules",
    "items": [
      "api/modules/ghostly_engine",
      "api/modules/ghostly_runtime"
    ]
  },
  {
    "type": "category",
    "label": "Namespaces",
    "items": [
      "api/modules/ghostly_runtime.ghostly"
    ]
  },
  {
    "type": "category",
    "label": "Classes",
    "items": [
      "api/classes/ghostly_engine.engine",
      "api/classes/ghostly_engine.response",
      "api/classes/ghostly_runtime.ghostlyerror"
    ]
  },
  {
    "type": "category",
    "label": "Interfaces",
    "items": [
      "api/interfaces/ghostly_engine.engineconfig",
      "api/interfaces/ghostly_engine.httperrorresponse",
      "api/interfaces/ghostly_engine.httprenderrequest",
      "api/interfaces/ghostly_engine.httprenderresult",
      "api/interfaces/ghostly_engine.model",
      "api/interfaces/ghostly_engine.renderresult",
      "api/interfaces/ghostly_engine.templateengine",
      "api/interfaces/ghostly_engine.view",
      "api/interfaces/ghostly_runtime.attachmentinfo",
      "api/interfaces/ghostly_runtime.model",
      "api/interfaces/ghostly_runtime.resultinfo",
      "api/interfaces/ghostly_runtime.template",
      "api/interfaces/ghostly_runtime.view"
    ]
  }
];