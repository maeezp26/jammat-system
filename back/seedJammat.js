import mongoose from "mongoose";

mongoose.connect("mongodb://maeez_jammat:maeezjammat2604@ac-lz0hmc3-shard-00-00.gqsql7w.mongodb.net:27017,ac-lz0hmc3-shard-00-01.gqsql7w.mongodb.net:27017,ac-lz0hmc3-shard-00-02.gqsql7w.mongodb.net:27017/jammatDB?ssl=true&replicaSet=atlas-xavkoz-shard-0&authSource=admin&retryWrites=true&w=majority");

// Schema
const jammatSchema = new mongoose.Schema({
  year: Number,
  month: String,
  category: String,
  jammatNo: Number,
  type: String,
  masjidName: String,
  route: [String],
  startDate: Date,
  endDate: Date,
  saathi: Number,
  isRamzan: Boolean,
  ameer: String,
  note: String,
  members: [
    {
      masjid: String,
      names: [String],
    },
  ],
}, { timestamps: true });

const Jammat = mongoose.model("Jammat", jammatSchema);

// March 2026
const data = [

  {
    year: 2026,
    month: "March",
    category: "men",
    jammatNo: 1,
    type: "3days",
    masjidName: "Bajipura",
    route: ["Makka Masjid Surat"],
    startDate: new Date("2026-03-03"),
    endDate: new Date("2026-03-05"),
    saathi: 8,
    isRamzan: true,
    ameer: "Aabid Asraf",
    members: [
      {
        masjid: "Bajipura",
        names: [
          "Aabid Asraf","Ammar Abdul Samad","Aasif Kakar","Saad Mohsin",
          "Aarif Bhai Shaikh","Imtiyaz Bhai Shaikh",
          "Noor Mohammed Jabir Shaikh","Maaz Imtiyaz"
        ]
      }
    ]
  },

  {
    year: 2026,
    month: "March",
    category: "men",
    jammatNo: 2,
    type: "3days",
    masjidName: "Jumma Masjid",
    route: ["Bhaj"],
    startDate: new Date("2026-03-06"),
    endDate: new Date("2026-03-08"),
    saathi: 11,
    isRamzan: true,
    ameer: "Sohel Salim",
    members: [
      {
        masjid: "Jumma Masjid",
        names: [
          "Sohel Salim","Sajid Ilyas","Imran Ilyas","Muhammad Liyakat",
          "Arman Memon","Rehan Tahir","Samir Saeed Kazi",
          "Asif Abdul Aziz","Rehan Abu Bakr","Rizwan Siddik"
        ]
      },
      { masjid: "Bilal Masjid", names: ["Munaf Malek"] }
    ]
  },

  {
    year: 2026,
    month: "March",
    category: "men",
    jammatNo: 3,
    type: "3days",
    masjidName: "Jumma Masjid",
    route: ["Rehmaiya IbadatKhana Gopchiwad Surat"],
    startDate: new Date("2026-03-08"),
    endDate: new Date("2026-03-10"),
    saathi: 7,
    isRamzan: true,
    ameer: "Zakir Habib",
    members: [
      {
        masjid: "Jumma Masjid",
        names: [
          "Zakir Habib","Maeez Nasir","Amaan Kazi",
          "Yaasir","Abrar Saiyad","Umer Aslam"
        ]
      },
      { masjid: "Noorani Masjid", names: ["Sokat Chacha Davji"] }
    ]
  },

  {
    year: 2026,
    month: "March",
    category: "men",
    jammatNo: 4,
    type: "3days",
    masjidName: "Jumma Masjid",
    route: ["Hafezji Masjid Surat"],
    startDate: new Date("2026-03-13"),
    endDate: new Date("2026-03-15"),
    saathi: 16,
    isRamzan: true,
    ameer: "Bilal Habib",
    members: [
      {
        masjid: "Jumma Masjid",
        names: [
          "Bilal Habib","Shoyeb Haveliwala","Ikram Bhai Kazi","Ajaz Mukhtiyar",
          "Hafiz Talha","Sohel Salim","Saad Munaf","Liyakat Karim",
          "Tahir Saiyad","Harish Ilyas","Zaki Mubin","Anas Imran",
          "Abdullah Hafiz Talha","Amin Hanif",
          "Abdul Rahim Abdul Gaffar","Ammar Kazi"
        ]
      }
    ]
  },

  {
    year: 2026,
    month: "March",
    category: "men",
    jammatNo: 5,
    type: "3days",
    masjidName: "Fatima Masjid",
    route: ["Makkah Masjid"],
    startDate: new Date("2026-03-13"),
    endDate: new Date("2026-03-15"),
    saathi: 13,
    isRamzan: true,
    ameer: "Mustafa Babu",
    members: [
      { masjid: "Fatima Masjid", names: ["Mustafa Babu","Rizwan Haq","Javid Abbas","Shahid Ghulam Ali","Faizan Soli Khalifa"] },
      { masjid: "Ayesha Masjid", names: ["Iqbal Bhai","Farhan Nasir"] },
      { masjid: "Bilal Masjid", names: ["Munaf Malek","Fahim Ansari","Zaid Zubair","Muhammad Saleh"] },
      { masjid: "Jumma Masjid", names: ["Sufiyan Rangrej"] },
      { masjid: "Noorani Masjid", names: ["Sajid Khaliq"] }
    ]
  },

  {
    year: 2026,
    month: "March",
    category: "men",
    jammatNo: 6,
    type: "3days",
    masjidName: "Jumma Masjid",
    route: ["Ghaas Wali Masjid Surat"],
    startDate: new Date("2026-03-27"),
    endDate: new Date("2026-03-29"),
    saathi: 9,
    isRamzan: true,
    ameer: "Shoyeb A Rashid",
    members: [
      { masjid: "Jumma Masjid", names: ["Shoyeb A Rashid","Mehmood Lalu","Sajid Ilyas","A Gaffar Multani","Ishaq Haveliwala"] },
      { masjid: "Ayesha Masjid", names: ["Shakil Rafik","Nazim Cutlery","Mo Sahil Salim"] },
      { masjid: "Noorani Masjid", names: ["Sajid Jalil"] }
    ]
  },

  {
    year: 2026,
    month: "March",
    category: "men",
    jammatNo: 7,
    type: "3days",
    masjidName: "Noorani Masjid",
    route: ["Badi Masjid Halka 6 Surat"],
    startDate: new Date("2026-03-27"),
    endDate: new Date("2026-03-29"),
    saathi: 9,
    isRamzan: true,
    ameer: "Iqbal Chirag",
    members: [
      { masjid: "Medina Masjid", names: ["Iqbal Chirag","Asif Pindhariya"] },
      { masjid: "Noorani Masjid", names: ["Asif Asad","Bilal Sakbhaji","Sajid Bashir","Hafiz A Rahman Khalil","Umar Razzak","Saeed Habib"] },
      { masjid: "Fatima Masjid", names: ["Usama Kasim"] }
    ]
  }

];
const seedData = async () => {
  try {
    await Jammat.insertMany(data);
    console.log("✅ Data Inserted Successfully");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedData();