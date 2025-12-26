# Shafi Store API Documentation

## Base URL
```
http://localhost:4000/api/v1
```

---

## Hero Slides API

### Get All Active Hero Slides (Public)
```
GET /hero
```
**Response:** Array of active hero slides sorted by order

### Get All Hero Slides (Admin)
```
GET /hero/admin
```
**Response:** Array of all hero slides (including inactive)

### Create Hero Slide
```
POST /hero/admin
```
**Body:**
```json
{
  "imagePath": "/assets/hero/slide1.jpg",
  "titleArabic": "العنوان بالعربية",
  "subtitleArabic": "العنوان الفرعي (اختياري)",
  "link": "/dates",
  "order": 1,
  "isActive": true
}
```

### Update Hero Slide
```
PUT /hero/admin/:id
```
**Body:** Same as create (partial updates allowed)

### Delete Hero Slide
```
DELETE /hero/admin/:id
```

---

## Dates Products API

### Get All Active Dates (Public)
```
GET /products/dates
```

### Get All Dates (Admin)
```
GET /products/dates/admin
```

### Get Single Date Product
```
GET /products/dates/:id
```

### Create Date Product
```
POST /products/dates
```
**Body:**
```json
{
  "title": "تمر خلاص الأحساء",
  "type": "Khalas",  // Khalas, Ajwa, Sukkary, Medjool, Safawi, Other
  "weight": "500g",
  "price": 150,
  "imagePath": "/assets/products/dates/khalas.jpg",
  "stock": 50,
  "luxuryDescription": "وصف تفصيلي للمنتج",
  "rating": 5
}
```

### Update Date Product
```
PUT /products/dates/:id
```

### Delete Date Product
```
DELETE /products/dates/:id
```

---

## Honey Products API

### Get All Active Honey (Public)
```
GET /products/honey
```

### Get All Honey (Admin)
```
GET /products/honey/admin
```

### Get Single Honey Product
```
GET /products/honey/:id
```

### Create Honey Product
```
POST /products/honey
```
**Body:**
```json
{
  "title": "عسل السدر اليمني",
  "origin": "اليمن",
  "weight": "500g",
  "price": 350,
  "imagePath": "/assets/products/honey/sidr.jpg",
  "stock": 30,
  "healthBenefits": "فوائد صحية متعددة",
  "rating": 5
}
```

### Update Honey Product
```
PUT /products/honey/:id
```

### Delete Honey Product
```
DELETE /products/honey/:id
```

---

## Oud Products API

### Get All Active Oud (Public)
```
GET /products/oud
```

### Get All Oud (Admin)
```
GET /products/oud/admin
```

### Get Single Oud Product
```
GET /products/oud/:id
```

### Create Oud Product
```
POST /products/oud
```
**Body:**
```json
{
  "title": "عود كمبودي معتق",
  "type": "Aged",  // Aged, Incense, Oil, Chips, Muattar, Other
  "price": 1500,
  "imagePath": "/assets/products/oud/cambodian.jpg",
  "stock": 10,
  "scentProfile": "عطر خشبي عميق مع لمسات حلوة",
  "rating": 5
}
```

### Update Oud Product
```
PUT /products/oud/:id
```

### Delete Oud Product
```
DELETE /products/oud/:id
```

---

## Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-26T11:00:00.000Z"
}
```

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "message": "Error description"
}
```

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

---

## Image Path Validation

All endpoints validate image paths before saving:
- Must start with `/` (local) or `http://`/`https://` (remote)
- Must end with valid image extension: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`, `.svg`
- Invalid paths return `400` with message: "Invalid image path format"
