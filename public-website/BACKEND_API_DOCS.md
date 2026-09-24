# Devojas Realtors — Backend API Integration Specification

This documentation explains all REST API endpoints, request/response JSON schemas, and data structures required by the frontend application.

---

## 1. Environment Setup

Configure your backend URL in `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```
*(When deploying to production, replace with your live API server URL, e.g. `https://api.yourdomain.com/api`)*.

---

## 2. API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/projects` | Returns list of all residential township projects |
| `GET` | `/api/projects/:id` | Returns single project details with plots |
| `GET` | `/api/projects/:id/plots` | Returns plot inventory and availability for a project |
| `POST` | `/api/enquiries` | Captures leads, callback requests, and plot bookings |
| `PUT` | `/api/projects/:id/plots/:plotId` | Updates a specific plot status (`Available`, `Sold`, `Booked`) |

---

## 3. Detailed Endpoint Schemas

### `GET /api/projects`
Returns an array of projects.

**Response `200 OK` JSON:**
```json
[
  {
    "id": "devojas-city",
    "name": "Devojas City",
    "tagline": "Varanasi's Premier Residential Township Project",
    "location": "Kaithi Toll Plaza & Markandeya Mahadev Corridor, Bhandaha Kalan, Ghazipur Road, Varanasi",
    "description": "Devojas City is a state-of-the-art residential plot development project offering premium plots of sizes 1000 SF and 1600 SF...",
    "sizes": ["1000 SF", "1600 SF"],
    "roads": ["20 Ft", "25 Ft", "30 Ft", "40 Ft"],
    "priceLabel": "Starting from ₹10.9 Lacs*",
    "imageUrl": "/assets/layout_plan.png",
    "pdfUrl": "/assets/devojas_city_layout.pdf",
    "reraApproved": true,
    "stats": {
      "totalPlots": 72,
      "soldPlots": 48,
      "bookedPlots": 6,
      "availablePlots": 18
    },
    "landmarks": [
      { "name": "Kaithi NHAI Toll Plaza", "distance": "0.5 KM / 1 Min" },
      { "name": "Markandey Mahadev Mandir (Sangam)", "distance": "1.5 KM / 3 Min" }
    ],
    "plots": [
      {
        "id": "DC-101",
        "plotNo": 101,
        "block": "Block A",
        "size": "1000 SF",
        "dimensions": "25 x 40 Ft",
        "facing": "East (Main Road)",
        "roadWidth": "30 Ft",
        "price": "₹12.50 Lacs",
        "status": "Available",
        "isCorner": true
      }
    ]
  }
]
```

---

### `GET /api/projects/:id/plots`
Returns the plot matrix array for a project.

**Response `200 OK` JSON:**
```json
{
  "projectId": "devojas-city",
  "totalPlots": 72,
  "availablePlots": 18,
  "soldPlots": 48,
  "bookedPlots": 6,
  "plots": [
    {
      "id": "DC-101",
      "plotNo": 101,
      "block": "Block A",
      "size": "1000 SF",
      "dimensions": "25 x 40 Ft",
      "facing": "East (Main Road)",
      "roadWidth": "30 Ft",
      "price": "₹12.50 Lacs",
      "status": "Available",
      "isCorner": true
    },
    {
      "id": "DC-102",
      "plotNo": 102,
      "block": "Block A",
      "size": "1000 SF",
      "dimensions": "25 x 40 Ft",
      "facing": "East",
      "roadWidth": "30 Ft",
      "price": "₹11.90 Lacs",
      "status": "Sold",
      "isCorner": false
    }
  ]
}
```

> **Plot Status Values:**
> - `"Available"` (🟢 Displays green badge with instant enquiry CTA)
> - `"Sold"` (🔴 Displays registered badge)
> - `"Booked"` (🟡 Displays token booked badge)

---

### `POST /api/enquiries`
Submits user leads from Contact Form, Navbar Callback Modal, Hero Search, or Plot Enquire button.

**Request Body JSON:**
```json
{
  "name": "Amit Sharma",
  "phone": "9876543210",
  "message": "Interested in Plot #101 in Block A",
  "preferredLocation": "Bhandaha Kalan (Kaithi)",
  "plotSize": "1000 Sq. Ft.",
  "budget": "15 - 20 Lacs",
  "projectName": "Devojas City",
  "enquiryType": "Navbar Callback Request",
  "source": "Website Frontend",
  "submittedAt": "2026-09-01T15:00:00.000Z"
}
```

**Response `201 Created` JSON:**
```json
{
  "success": true,
  "message": "Enquiry saved successfully",
  "leadId": "LEAD_984321"
}
```

---

## 4. CORS Requirements
Make sure your backend enables CORS for the frontend domain or `http://localhost:5173`:
```javascript
// Example Express.js middleware
const cors = require('cors');
app.use(cors({
  origin: '*', // or ['http://localhost:5173', 'https://yourdomain.com']
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```
