// Sample product data for testing JB's Tire & Auto API
// Use this data to populate your database for testing

const sampleProducts = [
  {
    name: "Michelin Pilot Sport 4S",
    brand: "Michelin",
    price: 29999, // $299.99 in cents
    size: "225/45R17",
    description: "High-performance summer tire designed for sports cars and high-performance vehicles. Excellent grip, precise handling, and superior braking performance.",
    imageUrl: "https://example.com/michelin-pilot-sport-4s.jpg",
    category: "tire",
    stockQuantity: 50,
    inStock: true,
    specifications: {
      "Season": "Summer",
      "Tread Life": "30,000 miles",
      "Speed Rating": "Y (186 mph)",
      "Load Index": "94"
    }
  },
  {
    name: "Bridgestone Blizzak WS90",
    brand: "Bridgestone",
    price: 18999, // $189.99 in cents
    size: "215/60R16",
    description: "Premium winter tire with advanced tread compound for superior traction on snow and ice. Perfect for harsh winter conditions.",
    imageUrl: "https://example.com/bridgestone-blizzak-ws90.jpg",
    category: "tire",
    stockQuantity: 35,
    inStock: true,
    specifications: {
      "Season": "Winter",
      "Tread Life": "40,000 miles",
      "Speed Rating": "T (118 mph)",
      "Load Index": "95"
    }
  },
  {
    name: "Goodyear Eagle F1 Asymmetric",
    brand: "Goodyear",
    price: 24999, // $249.99 in cents
    size: "245/40R18",
    description: "Ultra-high performance tire with asymmetric tread pattern for optimal handling and comfort. Ideal for luxury and sports vehicles.",
    imageUrl: "https://example.com/goodyear-eagle-f1.jpg",
    category: "tire",
    stockQuantity: 28,
    inStock: true,
    specifications: {
      "Season": "Summer",
      "Tread Life": "35,000 miles",
      "Speed Rating": "Y (186 mph)",
      "Load Index": "97"
    }
  },
  {
    name: "Continental ExtremeContact DWS06",
    brand: "Continental",
    price: 19999, // $199.99 in cents
    size: "225/50R17",
    description: "All-season performance tire with excellent wet and dry traction. Features advanced silica compound for enhanced grip.",
    imageUrl: "https://example.com/continental-dws06.jpg",
    category: "tire",
    stockQuantity: 42,
    inStock: true,
    specifications: {
      "Season": "All-Season",
      "Tread Life": "50,000 miles",
      "Speed Rating": "W (168 mph)",
      "Load Index": "94"
    }
  },
  {
    name: "BBS CH-R 18x8.5",
    brand: "BBS",
    price: 45999, // $459.99 in cents
    size: "18x8.5",
    description: "Lightweight forged aluminum wheel with classic multi-spoke design. Perfect for performance and luxury vehicles.",
    imageUrl: "https://example.com/bbs-ch-r-18x85.jpg",
    category: "rim",
    stockQuantity: 20,
    inStock: true,
    specifications: {
      "Material": "Forged Aluminum",
      "Bolt Pattern": "5x114.3",
      "Offset": "+35mm",
      "Center Bore": "73.1mm",
      "Finish": "Satin Black"
    }
  },
  {
    name: "Enkei RPF1 17x9",
    brand: "Enkei",
    price: 28999, // $289.99 in cents
    size: "17x9",
    description: "Lightweight racing wheel designed for maximum performance. Popular choice for track and street applications.",
    imageUrl: "https://example.com/enkei-rpf1-17x9.jpg",
    category: "rim",
    stockQuantity: 15,
    inStock: true,
    specifications: {
      "Material": "Cast Aluminum",
      "Bolt Pattern": "5x100",
      "Offset": "+45mm",
      "Center Bore": "73mm",
      "Finish": "Gold"
    }
  },
  {
    name: "Vossen CV3-R 20x10.5",
    brand: "Vossen",
    price: 62999, // $629.99 in cents
    size: "20x10.5",
    description: "Luxury forged wheel with deep concave profile. Premium finish and exceptional quality for high-end vehicles.",
    imageUrl: "https://example.com/vossen-cv3r-20x105.jpg",
    category: "rim",
    stockQuantity: 8,
    inStock: true,
    specifications: {
      "Material": "Forged Aluminum",
      "Bolt Pattern": "5x120",
      "Offset": "+25mm",
      "Center Bore": "72.6mm",
      "Finish": "Graphite"
    }
  },
  {
    name: "Method Race Wheels MR502 VT-SPEC",
    brand: "Method",
    price: 24999, // $249.99 in cents
    size: "15x7",
    description: "Rugged off-road wheel designed for rally and desert racing. Built to withstand extreme conditions.",
    imageUrl: "https://example.com/method-mr502-15x7.jpg",
    category: "rim",
    stockQuantity: 25,
    inStock: true,
    specifications: {
      "Material": "Cast Aluminum",
      "Bolt Pattern": "5x100",
      "Offset": "+15mm",
      "Center Bore": "73mm",
      "Finish": "Bronze"
    }
  },
  {
    name: "Tire Pressure Monitoring System",
    brand: "JB's Auto",
    price: 12999, // $129.99 in cents
    size: "Universal",
    description: "Advanced TPMS system with wireless sensors and LCD display. Monitor tire pressure and temperature in real-time.",
    imageUrl: "https://example.com/tpms-system.jpg",
    category: "accessory",
    stockQuantity: 30,
    inStock: true,
    specifications: {
      "Display Type": "LCD",
      "Sensor Type": "Wireless",
      "Battery Life": "5 years",
      "Operating Temperature": "-40°F to 185°F"
    }
  },
  {
    name: "Wheel Alignment Service",
    brand: "JB's Auto",
    price: 8999, // $89.99 in cents
    size: "Service",
    description: "Professional 4-wheel alignment service to ensure optimal tire wear and vehicle handling. Includes alignment report.",
    imageUrl: "https://example.com/wheel-alignment.jpg",
    category: "accessory",
    stockQuantity: 100,
    inStock: true,
    specifications: {
      "Service Duration": "1 hour",
      "Includes": "Alignment Report",
      "Warranty": "6 months",
      "Vehicle Types": "Most cars and light trucks"
    }
  }
];

module.exports = sampleProducts;

// Instructions for using this data:
// 1. Copy this data
// 2. Use Postman to POST each product to http://localhost:5000/api/products
// 3. Or create a simple script to bulk insert this data into your database
