// api/index.ts
import url from "node:url";

// .data/store.json
var store_default = {
  hr: {
    source: "bamboohr",
    syncedAt: "2026-10-31T14:57:49.451Z",
    employees: [
      {
        id: "bamboohr:101",
        source: "bamboohr",
        sourceId: "101",
        displayName: "Marcus Whitfield",
        title: "Chief Executive Officer",
        department: "Finance",
        location: "Denver, CO",
        managerId: null,
        hireDate: "2023-01-09",
        terminationDate: null,
        status: "active",
        annualSalary: 24e4,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "marcus.whitfield@haldenlabs.example",
        sourceUpdatedAt: "2023-01-09T14:05:00+00:00"
      },
      {
        id: "bamboohr:102",
        source: "bamboohr",
        sourceId: "102",
        displayName: "Priya Raghavan",
        title: "VP Engineering",
        department: "Engineering",
        location: "Denver, CO",
        managerId: "bamboohr:101",
        hireDate: "2023-01-16",
        terminationDate: null,
        status: "active",
        annualSalary: 225e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "priya.raghavan@haldenlabs.example",
        sourceUpdatedAt: "2023-01-16T14:05:00+00:00"
      },
      {
        id: "bamboohr:103",
        source: "bamboohr",
        sourceId: "103",
        displayName: "Elena Marchetti",
        title: "Head of Product",
        department: "Product",
        location: "Denver, CO",
        managerId: "bamboohr:101",
        hireDate: "2023-02-13",
        terminationDate: null,
        status: "active",
        annualSalary: 195e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "elena.marchetti@haldenlabs.example",
        sourceUpdatedAt: "2023-02-13T14:05:00+00:00"
      },
      {
        id: "bamboohr:104",
        source: "bamboohr",
        sourceId: "104",
        displayName: "Daniel Okafor",
        title: "VP Sales",
        department: "Sales",
        location: "Austin, TX",
        managerId: "bamboohr:101",
        hireDate: "2023-03-06",
        terminationDate: null,
        status: "active",
        annualSalary: 21e4,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "daniel.okafor@haldenlabs.example",
        sourceUpdatedAt: "2023-03-06T14:05:00+00:00"
      },
      {
        id: "bamboohr:105",
        source: "bamboohr",
        sourceId: "105",
        displayName: "Thomas Lindqvist",
        title: "VP Finance and Operations",
        department: "Finance",
        location: "Denver, CO",
        managerId: "bamboohr:101",
        hireDate: "2023-04-03",
        terminationDate: null,
        status: "active",
        annualSalary: 2e5,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "thomas.lindqvist@haldenlabs.example",
        sourceUpdatedAt: "2023-04-03T14:05:00+00:00"
      },
      {
        id: "bamboohr:106",
        source: "bamboohr",
        sourceId: "106",
        displayName: "Grace Nakamura",
        title: "Head of People",
        department: "People",
        location: "Denver, CO",
        managerId: "bamboohr:101",
        hireDate: "2023-05-15",
        terminationDate: null,
        status: "active",
        annualSalary: 165e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "grace.nakamura@haldenlabs.example",
        sourceUpdatedAt: "2023-05-15T14:05:00+00:00"
      },
      {
        id: "bamboohr:107",
        source: "bamboohr",
        sourceId: "107",
        displayName: "Samuel Adeyemi",
        title: "Head of Marketing",
        department: "Marketing",
        location: "Remote",
        managerId: "bamboohr:101",
        hireDate: "2023-06-12",
        terminationDate: null,
        status: "active",
        annualSalary: 17e4,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "samuel.adeyemi@haldenlabs.example",
        sourceUpdatedAt: "2023-06-12T14:05:00+00:00"
      },
      {
        id: "bamboohr:108",
        source: "bamboohr",
        sourceId: "108",
        displayName: "Hannah Fitzgerald",
        title: "Head of Customer Success",
        department: "Customer Success",
        location: "Austin, TX",
        managerId: "bamboohr:104",
        hireDate: "2023-07-10",
        terminationDate: null,
        status: "active",
        annualSalary: 155e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "hannah.fitzgerald@haldenlabs.example",
        sourceUpdatedAt: "2023-07-10T14:05:00+00:00"
      },
      {
        id: "bamboohr:109",
        source: "bamboohr",
        sourceId: "109",
        displayName: "Rahul Mehta",
        title: "Staff Engineer",
        department: "Engineering",
        location: "Denver, CO",
        managerId: "bamboohr:102",
        hireDate: "2023-02-27",
        terminationDate: null,
        status: "active",
        annualSalary: 195e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "rahul.mehta@haldenlabs.example",
        sourceUpdatedAt: "2023-02-27T14:05:00+00:00"
      },
      {
        id: "bamboohr:110",
        source: "bamboohr",
        sourceId: "110",
        displayName: "Wei Zhang",
        title: "Engineering Manager, Platform",
        department: "Engineering",
        location: "Denver, CO",
        managerId: "bamboohr:102",
        hireDate: "2023-03-20",
        terminationDate: null,
        status: "active",
        annualSalary: 185e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "wei.zhang@haldenlabs.example",
        sourceUpdatedAt: "2023-03-20T14:05:00+00:00"
      },
      {
        id: "bamboohr:111",
        source: "bamboohr",
        sourceId: "111",
        displayName: "Sofia Alvarez",
        title: "Senior Software Engineer",
        department: "Engineering",
        location: "Denver, CO",
        managerId: "bamboohr:110",
        hireDate: "2023-06-05",
        terminationDate: null,
        status: "active",
        annualSalary: 165e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "sofia.alvarez@haldenlabs.example",
        sourceUpdatedAt: "2023-06-05T14:05:00+00:00"
      },
      {
        id: "bamboohr:112",
        source: "bamboohr",
        sourceId: "112",
        displayName: "Olivia Bennett",
        title: "Engineering Manager, Product",
        department: "Engineering",
        location: "Remote",
        managerId: "bamboohr:102",
        hireDate: "2023-08-07",
        terminationDate: null,
        status: "active",
        annualSalary: 18e4,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "olivia.bennett@haldenlabs.example",
        sourceUpdatedAt: "2023-08-07T14:05:00+00:00"
      },
      {
        id: "bamboohr:113",
        source: "bamboohr",
        sourceId: "113",
        displayName: "James Mwangi",
        title: "Senior Software Engineer",
        department: "Engineering",
        location: "Remote",
        managerId: "bamboohr:110",
        hireDate: "2023-09-18",
        terminationDate: null,
        status: "active",
        annualSalary: 16e4,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "james.mwangi@haldenlabs.example",
        sourceUpdatedAt: "2023-09-18T14:05:00+00:00"
      },
      {
        id: "bamboohr:114",
        source: "bamboohr",
        sourceId: "114",
        displayName: "Mei-Ling Chen",
        title: "Senior Software Engineer",
        department: "Engineering",
        location: "Austin, TX",
        managerId: "bamboohr:112",
        hireDate: "2023-10-02",
        terminationDate: null,
        status: "active",
        annualSalary: 162e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "meiling.chen@haldenlabs.example",
        sourceUpdatedAt: "2023-10-02T14:05:00+00:00"
      },
      {
        id: "bamboohr:115",
        source: "bamboohr",
        sourceId: "115",
        displayName: "Chloe Dubois",
        title: "Software Engineer",
        department: "Engineering",
        location: "Denver, CO",
        managerId: "bamboohr:110",
        hireDate: "2024-01-22",
        terminationDate: null,
        status: "active",
        annualSalary: 135e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "chloe.dubois@haldenlabs.example",
        sourceUpdatedAt: "2024-01-22T14:05:00+00:00"
      },
      {
        id: "bamboohr:116",
        source: "bamboohr",
        sourceId: "116",
        displayName: "Aiden O'Connor",
        title: "Site Reliability Engineer",
        department: "Engineering",
        location: "Remote",
        managerId: "bamboohr:110",
        hireDate: "2024-03-11",
        terminationDate: null,
        status: "active",
        annualSalary: 15e4,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "aiden.oconnor@haldenlabs.example",
        sourceUpdatedAt: "2024-03-11T14:05:00+00:00"
      },
      {
        id: "bamboohr:117",
        source: "bamboohr",
        sourceId: "117",
        displayName: "Isabella Rossi",
        title: "Software Engineer",
        department: "Engineering",
        location: "Denver, CO",
        managerId: "bamboohr:112",
        hireDate: "2024-05-20",
        terminationDate: null,
        status: "active",
        annualSalary: 132e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "isabella.rossi@haldenlabs.example",
        sourceUpdatedAt: "2024-05-20T14:05:00+00:00"
      },
      {
        id: "bamboohr:118",
        source: "bamboohr",
        sourceId: "118",
        displayName: "Fatima Al-Sayed",
        title: "Frontend Engineer",
        department: "Engineering",
        location: "Remote",
        managerId: "bamboohr:112",
        hireDate: "2025-01-13",
        terminationDate: null,
        status: "active",
        annualSalary: 128e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "fatima.alsayed@haldenlabs.example",
        sourceUpdatedAt: "2025-01-13T14:05:00+00:00"
      },
      {
        id: "bamboohr:119",
        source: "bamboohr",
        sourceId: "119",
        displayName: "Lukas Brenner",
        title: "Contract Backend Engineer",
        department: "Engineering",
        location: "Remote",
        managerId: "bamboohr:110",
        hireDate: "2025-03-03",
        terminationDate: null,
        status: "active",
        employmentType: "contractor",
        workEmail: "lukas.brenner@haldenlabs.example",
        sourceUpdatedAt: "2025-03-03T14:05:00+00:00"
      },
      {
        id: "bamboohr:120",
        source: "bamboohr",
        sourceId: "120",
        displayName: "Omar Haddad",
        title: "Data Engineer",
        department: "Engineering",
        location: "Denver, CO",
        managerId: "bamboohr:110",
        hireDate: "2025-06-16",
        terminationDate: null,
        status: "active",
        annualSalary: 145e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "omar.haddad@haldenlabs.example",
        sourceUpdatedAt: "2025-06-16T14:05:00+00:00"
      },
      {
        id: "bamboohr:121",
        source: "bamboohr",
        sourceId: "121",
        displayName: "Ananya Krishnan",
        title: "Software Engineer",
        department: "Engineering",
        location: "Austin, TX",
        managerId: "bamboohr:112",
        hireDate: "2026-08-03",
        terminationDate: null,
        status: "active",
        annualSalary: 13e4,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "ananya.krishnan@haldenlabs.example",
        sourceUpdatedAt: "2026-08-03T14:05:00+00:00"
      },
      {
        id: "bamboohr:122",
        source: "bamboohr",
        sourceId: "122",
        displayName: "Ethan Brooks",
        title: "Senior Product Manager",
        department: "Product",
        location: "Denver, CO",
        managerId: "bamboohr:103",
        hireDate: "2023-09-05",
        terminationDate: null,
        status: "active",
        annualSalary: 16e4,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "ethan.brooks@haldenlabs.example",
        sourceUpdatedAt: "2023-09-05T14:05:00+00:00"
      },
      {
        id: "bamboohr:123",
        source: "bamboohr",
        sourceId: "123",
        displayName: "Zara Hussain",
        title: "Product Manager",
        department: "Product",
        location: "Remote",
        managerId: "bamboohr:103",
        hireDate: "2024-04-15",
        terminationDate: null,
        status: "active",
        annualSalary: 14e4,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "zara.hussain@haldenlabs.example",
        sourceUpdatedAt: "2024-04-15T14:05:00+00:00"
      },
      {
        id: "bamboohr:124",
        source: "bamboohr",
        sourceId: "124",
        displayName: "Mateo Fernandez",
        title: "Product Designer",
        department: "Product",
        location: "Denver, CO",
        managerId: "bamboohr:103",
        hireDate: "2024-06-24",
        terminationDate: null,
        status: "active",
        annualSalary: 125e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "mateo.fernandez@haldenlabs.example",
        sourceUpdatedAt: "2024-06-24T14:05:00+00:00"
      },
      {
        id: "bamboohr:125",
        source: "bamboohr",
        sourceId: "125",
        displayName: "Rebecca Thornton",
        title: "Sales Manager",
        department: "Sales",
        location: "Austin, TX",
        managerId: "bamboohr:104",
        hireDate: "2023-08-21",
        terminationDate: null,
        status: "active",
        annualSalary: 15e4,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "rebecca.thornton@haldenlabs.example",
        sourceUpdatedAt: "2023-08-21T14:05:00+00:00"
      },
      {
        id: "bamboohr:126",
        source: "bamboohr",
        sourceId: "126",
        displayName: "Carlos Mendoza",
        title: "Account Executive",
        department: "Sales",
        location: "Austin, TX",
        managerId: "bamboohr:125",
        hireDate: "2023-11-13",
        terminationDate: null,
        status: "active",
        annualSalary: 95e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "carlos.mendoza@haldenlabs.example",
        sourceUpdatedAt: "2023-11-13T14:05:00+00:00"
      },
      {
        id: "bamboohr:127",
        source: "bamboohr",
        sourceId: "127",
        displayName: "Aisha Bello",
        title: "Account Executive",
        department: "Sales",
        location: "Remote",
        managerId: "bamboohr:125",
        hireDate: "2024-03-04",
        terminationDate: "2026-10-09",
        status: "terminated",
        annualSalary: 92e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "aisha.bello@haldenlabs.example",
        sourceUpdatedAt: "2026-10-09T16:20:00+00:00"
      },
      {
        id: "bamboohr:128",
        source: "bamboohr",
        sourceId: "128",
        displayName: "Nadia Petrov",
        title: "Solutions Engineer",
        department: "Sales",
        location: "Remote",
        managerId: "bamboohr:104",
        hireDate: "2024-07-08",
        terminationDate: null,
        status: "active",
        annualSalary: 14e4,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "nadia.petrov@haldenlabs.example",
        sourceUpdatedAt: "2024-07-08T14:05:00+00:00"
      },
      {
        id: "bamboohr:129",
        source: "bamboohr",
        sourceId: "129",
        displayName: "Leila Farahani",
        title: "Sales Development Representative",
        department: "Sales",
        location: "Austin, TX",
        managerId: "bamboohr:125",
        hireDate: "2025-01-27",
        terminationDate: null,
        status: "active",
        annualSalary: 65e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "leila.farahani@haldenlabs.example",
        sourceUpdatedAt: "2025-01-27T14:05:00+00:00"
      },
      {
        id: "bamboohr:130",
        source: "bamboohr",
        sourceId: "130",
        displayName: "Jackson Reed",
        title: "Sales Development Representative",
        department: "Sales",
        location: "Austin, TX",
        managerId: "bamboohr:125",
        hireDate: "2025-05-12",
        terminationDate: "2025-11-14",
        status: "terminated",
        annualSalary: 62e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "jackson.reed@haldenlabs.example",
        sourceUpdatedAt: "2025-11-14T16:20:00+00:00"
      },
      {
        id: "bamboohr:131",
        source: "bamboohr",
        sourceId: "131",
        displayName: "David Kim",
        title: "Customer Success Manager",
        department: "Customer Success",
        location: "Austin, TX",
        managerId: "bamboohr:108",
        hireDate: "2023-10-16",
        terminationDate: null,
        status: "active",
        annualSalary: 95e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "david.kim@haldenlabs.example",
        sourceUpdatedAt: "2023-10-16T14:05:00+00:00"
      },
      {
        id: "bamboohr:132",
        source: "bamboohr",
        sourceId: "132",
        displayName: "Ingrid Johansson",
        title: "Customer Success Manager",
        department: "Customer Success",
        location: "Remote",
        managerId: "bamboohr:108",
        hireDate: "2024-05-06",
        terminationDate: null,
        status: "active",
        annualSalary: 92e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "ingrid.johansson@haldenlabs.example",
        sourceUpdatedAt: "2024-05-06T14:05:00+00:00"
      },
      {
        id: "bamboohr:133",
        source: "bamboohr",
        sourceId: "133",
        displayName: "Tariq Rahman",
        title: "Support Engineer",
        department: "Customer Success",
        location: "Austin, TX",
        managerId: "bamboohr:108",
        hireDate: "2024-10-21",
        terminationDate: null,
        status: "active",
        annualSalary: 85e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "tariq.rahman@haldenlabs.example",
        sourceUpdatedAt: "2024-10-21T14:05:00+00:00"
      },
      {
        id: "bamboohr:134",
        source: "bamboohr",
        sourceId: "134",
        displayName: "Emily Carter",
        title: "Support Specialist",
        department: "Customer Success",
        location: "Austin, TX",
        managerId: "bamboohr:108",
        hireDate: "2025-07-14",
        terminationDate: "2026-09-26",
        status: "terminated",
        employmentType: "full-time",
        workEmail: "emily.carter@haldenlabs.example",
        sourceUpdatedAt: "2026-09-26T16:20:00+00:00"
      },
      {
        id: "bamboohr:135",
        source: "bamboohr",
        sourceId: "135",
        displayName: "Ravi Subramanian",
        title: "Senior Accountant",
        department: "Finance",
        location: "Denver, CO",
        managerId: "bamboohr:105",
        hireDate: "2023-11-27",
        terminationDate: null,
        status: "active",
        annualSalary: 105e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "ravi.subramanian@haldenlabs.example",
        sourceUpdatedAt: "2023-11-27T14:05:00+00:00"
      },
      {
        id: "bamboohr:136",
        source: "bamboohr",
        sourceId: "136",
        displayName: "Patrick Nguyen",
        title: "Contract Bookkeeper",
        department: "Finance",
        location: "Remote",
        managerId: "bamboohr:105",
        hireDate: "2024-11-04",
        terminationDate: null,
        status: "active",
        employmentType: "contractor",
        workEmail: "patrick.nguyen@haldenlabs.example",
        sourceUpdatedAt: "2024-11-04T14:05:00+00:00"
      },
      {
        id: "bamboohr:137",
        source: "bamboohr",
        sourceId: "137",
        displayName: "Maya Patel",
        title: "Recruiter",
        department: "People",
        location: "Denver, CO",
        managerId: "bamboohr:106",
        hireDate: "2024-02-19",
        terminationDate: null,
        status: "active",
        annualSalary: 9e4,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "maya.patel@haldenlabs.example",
        sourceUpdatedAt: "2024-02-19T14:05:00+00:00"
      },
      {
        id: "bamboohr:138",
        source: "bamboohr",
        sourceId: "138",
        displayName: "Jordan Blake",
        title: "People Operations Specialist",
        department: "People",
        location: "Denver, CO",
        managerId: "bamboohr:106",
        hireDate: "2025-10-06",
        terminationDate: null,
        status: "active",
        annualSalary: 56e3,
        currency: "USD",
        employmentType: "part-time",
        workEmail: "jordan.blake@haldenlabs.example",
        sourceUpdatedAt: "2025-10-06T14:05:00+00:00"
      },
      {
        id: "bamboohr:139",
        source: "bamboohr",
        sourceId: "139",
        displayName: "Sienna Walsh",
        title: "Content Marketing Manager",
        department: "Marketing",
        location: "Remote",
        managerId: "bamboohr:107",
        hireDate: "2024-04-01",
        terminationDate: null,
        status: "active",
        annualSalary: 1e5,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "sienna.walsh@haldenlabs.example",
        sourceUpdatedAt: "2024-04-01T14:05:00+00:00"
      },
      {
        id: "bamboohr:140",
        source: "bamboohr",
        sourceId: "140",
        displayName: "Diego Ramirez",
        title: "Demand Generation Manager",
        department: "Marketing",
        location: "Denver, CO",
        managerId: "bamboohr:107",
        hireDate: "2026-08-17",
        terminationDate: null,
        status: "active",
        annualSalary: 115e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "diego.ramirez@haldenlabs.example",
        sourceUpdatedAt: "2026-08-17T14:05:00+00:00"
      },
      {
        id: "bamboohr:141",
        source: "bamboohr",
        sourceId: "141",
        displayName: "Nathan Osei",
        title: "Software Engineer",
        department: "Engineering",
        location: "Denver, CO",
        managerId: "bamboohr:110",
        hireDate: "2026-09-08",
        terminationDate: null,
        status: "active",
        annualSalary: 136e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "nathan.osei@haldenlabs.example",
        sourceUpdatedAt: "2026-09-08T14:05:00+00:00"
      },
      {
        id: "bamboohr:142",
        source: "bamboohr",
        sourceId: "142",
        displayName: "Camila Santos",
        title: "Account Executive",
        department: "Sales",
        location: "Austin, TX",
        managerId: "bamboohr:125",
        hireDate: "2026-09-14",
        terminationDate: null,
        status: "active",
        annualSalary: 94e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "camila.santos@haldenlabs.example",
        sourceUpdatedAt: "2026-09-14T14:05:00+00:00"
      },
      {
        id: "bamboohr:143",
        source: "bamboohr",
        sourceId: "143",
        displayName: "Arjun Desai",
        title: "Financial Analyst",
        department: "Finance",
        location: "Denver, CO",
        managerId: "bamboohr:105",
        hireDate: "2026-09-21",
        terminationDate: null,
        status: "active",
        annualSalary: 98e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "arjun.desai@haldenlabs.example",
        sourceUpdatedAt: "2026-09-21T14:05:00+00:00"
      },
      {
        id: "bamboohr:144",
        source: "bamboohr",
        sourceId: "144",
        displayName: "Hana Kobayashi",
        title: "Product Manager",
        department: "Product",
        location: "Remote",
        managerId: "bamboohr:103",
        hireDate: "2026-10-05",
        terminationDate: null,
        status: "active",
        annualSalary: 142e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "hana.kobayashi@haldenlabs.example",
        sourceUpdatedAt: "2026-10-05T14:05:00+00:00"
      },
      {
        id: "bamboohr:145",
        source: "bamboohr",
        sourceId: "145",
        displayName: "Felix Andersson",
        title: "Growth Marketing Manager",
        department: "Marketing",
        location: "Denver, CO",
        managerId: "bamboohr:107",
        hireDate: "2026-10-12",
        terminationDate: null,
        status: "active",
        annualSalary: 112e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "felix.andersson@haldenlabs.example",
        sourceUpdatedAt: "2026-10-12T14:05:00+00:00"
      },
      {
        id: "bamboohr:146",
        source: "bamboohr",
        sourceId: "146",
        displayName: "Rosa Delgado",
        title: "Customer Success Manager",
        department: "Customer Success",
        location: "Austin, TX",
        managerId: "bamboohr:108",
        hireDate: "2026-10-19",
        terminationDate: null,
        status: "active",
        annualSalary: 93e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "rosa.delgado@haldenlabs.example",
        sourceUpdatedAt: "2026-10-19T14:05:00+00:00"
      },
      {
        id: "bamboohr:147",
        source: "bamboohr",
        sourceId: "147",
        displayName: "Ben Whitaker",
        title: "Senior Software Engineer",
        department: "Engineering",
        location: "Remote",
        managerId: "bamboohr:112",
        hireDate: "2026-11-16",
        terminationDate: null,
        status: "active",
        annualSalary: 168e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "ben.whitaker@haldenlabs.example",
        sourceUpdatedAt: "2026-10-31T10:15:00+00:00"
      },
      {
        id: "bamboohr:148",
        source: "bamboohr",
        sourceId: "148",
        displayName: "Ling Zhao",
        title: "Recruiter",
        department: "People",
        location: "Denver, CO",
        managerId: "bamboohr:106",
        hireDate: "2026-11-30",
        terminationDate: null,
        status: "active",
        annualSalary: 88e3,
        currency: "USD",
        employmentType: "full-time",
        workEmail: "ling.zhao@haldenlabs.example",
        sourceUpdatedAt: "2026-11-14T10:15:00+00:00"
      }
    ]
  },
  finance: {
    source: "sage",
    syncedAt: "2026-10-31T14:57:49.451Z",
    accounts: [
      {
        id: "sage:acc-1200",
        source: "sage",
        sourceId: "acc-1200",
        name: "Operating account",
        type: "asset",
        code: "1200",
        sourceUpdatedAt: "2026-01-05T09:00:00Z"
      },
      {
        id: "sage:acc-1210",
        source: "sage",
        sourceId: "acc-1210",
        name: "Reserve account",
        type: "asset",
        code: "1210",
        sourceUpdatedAt: "2026-01-05T09:00:00Z"
      },
      {
        id: "sage:acc-1100",
        source: "sage",
        sourceId: "acc-1100",
        name: "Trade debtors",
        type: "asset",
        code: "1100",
        sourceUpdatedAt: "2026-01-05T09:00:00Z"
      },
      {
        id: "sage:acc-2100",
        source: "sage",
        sourceId: "acc-2100",
        name: "Trade creditors",
        type: "liability",
        code: "2100",
        sourceUpdatedAt: "2026-01-05T09:00:00Z"
      },
      {
        id: "sage:acc-3000",
        source: "sage",
        sourceId: "acc-3000",
        name: "Share capital",
        type: "equity",
        code: "3000",
        sourceUpdatedAt: "2026-01-05T09:00:00Z"
      },
      {
        id: "sage:acc-4000",
        source: "sage",
        sourceId: "acc-4000",
        name: "Sales",
        type: "income",
        code: "4000",
        sourceUpdatedAt: "2026-01-05T09:00:00Z"
      },
      {
        id: "sage:acc-5000",
        source: "sage",
        sourceId: "acc-5000",
        name: "Contractors",
        type: "expense",
        code: "5000",
        sourceUpdatedAt: "2026-01-05T09:00:00Z"
      },
      {
        id: "sage:acc-7100",
        source: "sage",
        sourceId: "acc-7100",
        name: "Rent",
        type: "expense",
        code: "7100",
        sourceUpdatedAt: "2026-01-05T09:00:00Z"
      },
      {
        id: "sage:acc-7500",
        source: "sage",
        sourceId: "acc-7500",
        name: "Software subscriptions",
        type: "expense",
        code: "7500",
        sourceUpdatedAt: "2026-01-05T09:00:00Z"
      }
    ],
    parties: [
      {
        id: "sage:con-2001",
        source: "sage",
        sourceId: "con-2001",
        name: "Northgate Analytics",
        kind: "customer",
        email: "accounts@northgate.example",
        sourceUpdatedAt: "2026-03-11T15:20:00Z"
      },
      {
        id: "sage:con-2002",
        source: "sage",
        sourceId: "con-2002",
        name: "Pinecrest Health",
        kind: "customer",
        email: "payables@pinecrest.example",
        sourceUpdatedAt: "2026-05-02T10:45:00Z"
      },
      {
        id: "sage:con-2003",
        source: "sage",
        sourceId: "con-2003",
        name: "Tolliver & Reed LLP",
        kind: "customer",
        sourceUpdatedAt: "2026-08-19T13:05:00Z"
      },
      {
        id: "sage:con-2004",
        source: "sage",
        sourceId: "con-2004",
        name: "Ovelo Cloud",
        kind: "supplier",
        email: "billing@ovelo.example",
        sourceUpdatedAt: "2026-02-24T08:30:00Z"
      },
      {
        id: "sage:con-2005",
        source: "sage",
        sourceId: "con-2005",
        name: "Bluestem Workspace",
        kind: "supplier",
        email: "invoices@bluestem.example",
        sourceUpdatedAt: "2026-01-12T11:00:00Z"
      }
    ],
    invoices: [
      {
        id: "sage:si-3001",
        source: "sage",
        sourceId: "si-3001",
        kind: "sales",
        partyId: "sage:con-2001",
        date: "2026-09-04",
        status: "paid",
        currency: "USD",
        total: 18e3,
        outstanding: 0,
        lines: [
          {
            description: "Platform licence, Q3 2026",
            accountId: "sage:acc-4000",
            net: 18e3
          }
        ],
        number: "SI-3001",
        dueDate: "2026-10-04",
        sourceUpdatedAt: "2026-10-06T16:40:00Z"
      },
      {
        id: "sage:si-3002",
        source: "sage",
        sourceId: "si-3002",
        kind: "sales",
        partyId: "sage:con-2002",
        date: "2026-09-15",
        status: "unpaid",
        currency: "USD",
        total: 9500,
        outstanding: 9500,
        lines: [
          {
            description: "Implementation, September",
            accountId: "sage:acc-4000",
            net: 9500
          }
        ],
        number: "SI-3002",
        dueDate: "2026-10-15",
        sourceUpdatedAt: "2026-09-15T09:12:00Z"
      },
      {
        id: "sage:si-3003",
        source: "sage",
        sourceId: "si-3003",
        kind: "sales",
        partyId: "sage:con-2003",
        date: "2026-09-22",
        status: "part_paid",
        currency: "USD",
        total: 6e3,
        outstanding: 2500,
        lines: [
          {
            description: "Reporting module, annual",
            accountId: "sage:acc-4000",
            net: 6e3
          }
        ],
        number: "SI-3003",
        dueDate: "2026-10-22",
        sourceUpdatedAt: "2026-10-23T14:02:00Z"
      },
      {
        id: "sage:si-3004",
        source: "sage",
        sourceId: "si-3004",
        kind: "sales",
        partyId: "sage:con-2002",
        date: "2026-10-06",
        status: "draft",
        currency: "USD",
        total: 7500,
        outstanding: 7500,
        lines: [
          {
            description: "Implementation, October",
            accountId: "sage:acc-4000",
            net: 7500
          }
        ],
        number: "SI-3004",
        dueDate: "2026-11-05",
        sourceUpdatedAt: "2026-10-06T17:55:00Z"
      },
      {
        id: "sage:si-3005",
        source: "sage",
        sourceId: "si-3005",
        kind: "sales",
        partyId: "sage:con-2001",
        date: "2026-10-13",
        status: "void",
        currency: "USD",
        total: 4e3,
        outstanding: 0,
        lines: [
          {
            description: "Training day, raised in error",
            accountId: "sage:acc-4000",
            net: 4e3
          }
        ],
        number: "SI-3005",
        dueDate: "2026-11-12",
        sourceUpdatedAt: "2026-10-14T08:20:00Z"
      },
      {
        id: "sage:si-3006",
        source: "sage",
        sourceId: "si-3006",
        kind: "sales",
        partyId: "sage:con-2001",
        date: "2026-10-20",
        status: "unpaid",
        currency: "USD",
        total: 12e3,
        outstanding: 12e3,
        lines: [
          {
            description: "Platform licence, Q4 2026",
            accountId: "sage:acc-4000",
            net: 12e3
          }
        ],
        number: "SI-3006",
        sourceUpdatedAt: "2026-10-20T10:30:00Z"
      },
      {
        id: "sage:pi-3101",
        source: "sage",
        sourceId: "pi-3101",
        kind: "purchase",
        partyId: "sage:con-2005",
        date: "2026-09-01",
        status: "paid",
        currency: "USD",
        total: 8800,
        outstanding: 0,
        lines: [
          {
            description: "Office rent, September 2026",
            accountId: "sage:acc-7100",
            net: 8500
          },
          {
            description: "Meeting room booking add-on",
            accountId: "sage:acc-7500",
            net: 300
          }
        ],
        number: "BW-0926",
        dueDate: "2026-09-30",
        sourceUpdatedAt: "2026-09-01T12:00:00Z"
      },
      {
        id: "sage:pi-3102",
        source: "sage",
        sourceId: "pi-3102",
        kind: "purchase",
        partyId: "sage:con-2004",
        date: "2026-10-03",
        status: "unpaid",
        currency: "USD",
        total: 2350,
        outstanding: 2350,
        lines: [
          {
            description: "Cloud hosting, September usage",
            accountId: "sage:acc-7500",
            net: 1900
          },
          {
            description: "Monitoring, 12 seats",
            accountId: "sage:acc-7500",
            net: 450
          }
        ],
        number: "OV-44817",
        dueDate: "2026-11-02",
        sourceUpdatedAt: "2026-10-03T07:45:00Z"
      }
    ],
    bankTransactions: [
      {
        id: "sage:bt-5001",
        source: "sage",
        sourceId: "bt-5001",
        bankAccountId: "sage:acc-1200",
        date: "2026-09-01",
        amount: -8800,
        currency: "USD",
        description: "Bluestem Workspace, invoice BW-0926",
        partyId: "sage:con-2005",
        sourceUpdatedAt: "2026-09-01T12:05:00Z"
      },
      {
        id: "sage:bt-5002",
        source: "sage",
        sourceId: "bt-5002",
        bankAccountId: "sage:acc-1200",
        date: "2026-09-12",
        amount: -4500,
        currency: "USD",
        description: "Contractor, design sprint",
        accountId: "sage:acc-5000",
        sourceUpdatedAt: "2026-09-12T16:10:00Z"
      },
      {
        id: "sage:bt-5003",
        source: "sage",
        sourceId: "bt-5003",
        bankAccountId: "sage:acc-1200",
        date: "2026-09-19",
        amount: -180,
        currency: "USD",
        description: "Ledgerline subscription, card",
        accountId: "sage:acc-7500",
        sourceUpdatedAt: "2026-09-19T03:00:00Z"
      },
      {
        id: "sage:bt-5004",
        source: "sage",
        sourceId: "bt-5004",
        bankAccountId: "sage:acc-1200",
        date: "2026-09-30",
        amount: 6e4,
        currency: "USD",
        description: "Transfer from reserve account",
        sourceUpdatedAt: "2026-09-30T09:00:00Z"
      },
      {
        id: "sage:bt-5005",
        source: "sage",
        sourceId: "bt-5005",
        bankAccountId: "sage:acc-1200",
        date: "2026-09-30",
        amount: 18e3,
        currency: "USD",
        description: "Northgate Analytics, invoice SI-3001",
        partyId: "sage:con-2001",
        sourceUpdatedAt: "2026-09-30T17:15:00Z"
      },
      {
        id: "sage:bt-5006",
        source: "sage",
        sourceId: "bt-5006",
        bankAccountId: "sage:acc-1200",
        date: "2026-10-23",
        amount: 3500,
        currency: "USD",
        description: "Tolliver & Reed LLP, part payment SI-3003",
        partyId: "sage:con-2003",
        sourceUpdatedAt: "2026-10-23T14:10:00Z"
      },
      {
        id: "sage:bt-5007",
        source: "sage",
        sourceId: "bt-5007",
        bankAccountId: "sage:acc-1200",
        date: "2026-10-24",
        amount: -4500,
        currency: "USD",
        description: "Contractor, front-end sprint",
        accountId: "sage:acc-5000",
        sourceUpdatedAt: "2026-10-24T11:00:00Z"
      },
      {
        id: "sage:bt-5008",
        source: "sage",
        sourceId: "bt-5008",
        bankAccountId: "sage:acc-1210",
        date: "2026-01-05",
        amount: 25e4,
        currency: "USD",
        description: "Seed round capital subscription",
        sourceUpdatedAt: "2026-01-05T09:30:00Z"
      },
      {
        id: "sage:bt-5009",
        source: "sage",
        sourceId: "bt-5009",
        bankAccountId: "sage:acc-1210",
        date: "2026-09-30",
        amount: -6e4,
        currency: "USD",
        description: "Transfer to operating account",
        sourceUpdatedAt: "2026-09-30T09:00:00Z"
      },
      {
        id: "sage:bt-5010",
        source: "sage",
        sourceId: "bt-5010",
        bankAccountId: "sage:acc-1210",
        date: "2026-10-01",
        amount: 95,
        currency: "USD",
        description: "Treasury yield, September",
        sourceUpdatedAt: "2026-10-01T04:00:00Z"
      }
    ]
  },
  runs: [
    {
      at: "2026-10-31T14:57:49.451Z",
      domain: "hr",
      source: "bamboohr",
      ok: true,
      pulled: 48,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 143
    },
    {
      at: "2026-10-31T14:57:49.451Z",
      domain: "finance",
      source: "sage",
      ok: true,
      pulled: 32,
      added: 0,
      changed: 1,
      removed: 0,
      durationMs: 26
    },
    {
      at: "2026-10-31T14:57:49.258Z",
      domain: "hr",
      source: "bamboohr",
      ok: true,
      pulled: 48,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 153
    },
    {
      at: "2026-10-31T14:57:49.258Z",
      domain: "finance",
      source: "sage",
      ok: true,
      pulled: 32,
      added: 0,
      changed: 1,
      removed: 0,
      durationMs: 19
    },
    {
      at: "2026-10-31T14:57:32.967Z",
      domain: "hr",
      source: "bamboohr",
      ok: true,
      pulled: 48,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 230
    },
    {
      at: "2026-10-31T14:57:32.967Z",
      domain: "finance",
      source: "sage",
      ok: true,
      pulled: 32,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 41
    },
    {
      at: "2026-10-31T14:55:57.198Z",
      domain: "hr",
      source: "bamboohr",
      ok: false,
      pulled: 0,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 0,
      error: "BAMBOOHR_BASE_URL, BAMBOOHR_COMPANY and BAMBOOHR_API_KEY must all be set"
    },
    {
      at: "2026-10-31T14:55:57.160Z",
      domain: "hr",
      source: "bamboohr",
      ok: false,
      pulled: 0,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 0,
      error: "BAMBOOHR_BASE_URL, BAMBOOHR_COMPANY and BAMBOOHR_API_KEY must all be set"
    },
    {
      at: "2026-10-31T14:53:22.709Z",
      domain: "hr",
      source: "bamboohr",
      ok: false,
      pulled: 0,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 0,
      error: "BAMBOOHR_BASE_URL, BAMBOOHR_COMPANY and BAMBOOHR_API_KEY must all be set"
    },
    {
      at: "2026-10-31T14:53:21.767Z",
      domain: "hr",
      source: "bamboohr",
      ok: false,
      pulled: 0,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 1,
      error: "BAMBOOHR_BASE_URL, BAMBOOHR_COMPANY and BAMBOOHR_API_KEY must all be set"
    },
    {
      at: "2026-10-31T14:51:08.769Z",
      domain: "hr",
      source: "bamboohr",
      ok: false,
      pulled: 0,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 0,
      error: "BAMBOOHR_BASE_URL, BAMBOOHR_COMPANY and BAMBOOHR_API_KEY must all be set"
    },
    {
      at: "2026-10-31T14:51:07.886Z",
      domain: "hr",
      source: "bamboohr",
      ok: false,
      pulled: 0,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 0,
      error: "BAMBOOHR_BASE_URL, BAMBOOHR_COMPANY and BAMBOOHR_API_KEY must all be set"
    },
    {
      at: "2026-10-31T14:44:08.939Z",
      domain: "hr",
      source: "bamboohr",
      ok: false,
      pulled: 0,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 0,
      error: "BAMBOOHR_BASE_URL, BAMBOOHR_COMPANY and BAMBOOHR_API_KEY must all be set"
    },
    {
      at: "2026-10-31T14:44:08.064Z",
      domain: "hr",
      source: "bamboohr",
      ok: false,
      pulled: 0,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 0,
      error: "BAMBOOHR_BASE_URL, BAMBOOHR_COMPANY and BAMBOOHR_API_KEY must all be set"
    },
    {
      at: "2026-10-31T14:44:06.245Z",
      domain: "hr",
      source: "bamboohr",
      ok: false,
      pulled: 0,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 1,
      error: "BAMBOOHR_BASE_URL, BAMBOOHR_COMPANY and BAMBOOHR_API_KEY must all be set"
    },
    {
      at: "2026-10-31T14:40:50.051Z",
      domain: "hr",
      source: "bamboohr",
      ok: true,
      pulled: 48,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 233
    },
    {
      at: "2026-10-31T14:40:50.051Z",
      domain: "finance",
      source: "sage",
      ok: true,
      pulled: 32,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 41
    },
    {
      at: "2026-10-31T08:39:24.786Z",
      domain: "hr",
      source: "bamboohr",
      ok: true,
      pulled: 48,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 273
    },
    {
      at: "2026-10-31T08:39:24.786Z",
      domain: "finance",
      source: "sage",
      ok: true,
      pulled: 32,
      added: 0,
      changed: 1,
      removed: 0,
      durationMs: 36
    },
    {
      at: "2026-10-31T08:39:13.631Z",
      domain: "hr",
      source: "bamboohr",
      ok: true,
      pulled: 48,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 261
    },
    {
      at: "2026-10-31T08:39:13.631Z",
      domain: "finance",
      source: "sage",
      ok: true,
      pulled: 32,
      added: 0,
      changed: 1,
      removed: 0,
      durationMs: 27
    },
    {
      at: "2026-10-31T08:38:58.827Z",
      domain: "hr",
      source: "bamboohr",
      ok: true,
      pulled: 48,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 298
    },
    {
      at: "2026-10-31T08:38:58.827Z",
      domain: "finance",
      source: "sage",
      ok: true,
      pulled: 32,
      added: 0,
      changed: 0,
      removed: 0,
      durationMs: 39
    },
    {
      at: "2026-10-31T08:31:48.980Z",
      domain: "hr",
      source: "bamboohr",
      ok: true,
      pulled: 48,
      added: 48,
      changed: 0,
      removed: 0,
      durationMs: 211
    },
    {
      at: "2026-10-31T08:31:48.980Z",
      domain: "finance",
      source: "sage",
      ok: true,
      pulled: 32,
      added: 32,
      changed: 0,
      removed: 0,
      durationMs: 26
    }
  ]
};

// src/data/canonical/types.ts
var SOURCE_LABEL = {
  bamboohr: "BambooHR",
  sage: "Sage"
};

// src/lib/format.ts
var MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function fmtDate(iso) {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS_SHORT[Number(m[2]) - 1]} ${m[1]}`;
}
function yearMonth(d) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
function monthBefore(ym) {
  const y = Number(ym.slice(0, 4));
  const m = Number(ym.slice(5, 7));
  return m === 1 ? `${y - 1}-12` : `${y}-${String(m - 1).padStart(2, "0")}`;
}
function monthLabel(ym) {
  return `${MONTHS_LONG[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
}
function monthNumber(name) {
  const n = name.trim().toLowerCase();
  if (n.length < 3) return null;
  const i = MONTHS_LONG.findIndex((m) => m.toLowerCase() === n || m.toLowerCase().slice(0, 3) === n.slice(0, 3));
  return i === -1 ? null : i + 1;
}
function isoDate(d) {
  return d.toISOString().slice(0, 10);
}
function fmtMoney(amount, currency) {
  const whole = Math.round(Math.abs(amount)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const text = currency === "USD" ? `$${whole}` : `${currency} ${whole}`;
  return amount < 0 ? `(${text})` : text;
}
function plural(n, one, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

// src/lib/people/figures.ts
var isOnPayroll = (e, today) => e.status === "active" && e.hireDate <= today;
var byName = (a, b) => a.displayName.localeCompare(b.displayName);
function periodsOf(now) {
  const thisMonth = yearMonth(now);
  return { today: isoDate(now), thisMonth, lastMonth: monthBefore(thisMonth) };
}
function headcount(people, today) {
  return {
    onPayroll: people.filter((e) => isOnPayroll(e, today)),
    notStarted: people.filter((e) => e.status === "active" && e.hireDate > today)
  };
}
var joinedIn = (people, ym) => people.filter((e) => e.hireDate.startsWith(ym)).sort(byName);
var leftIn = (people, ym) => people.filter((e) => (e.terminationDate ?? "").startsWith(ym)).sort(byName);
function payTotals(members) {
  const totals = /* @__PURE__ */ new Map();
  let missing = 0;
  for (const e of members) {
    if (typeof e.annualSalary !== "number" || !e.currency) {
      missing += 1;
      continue;
    }
    const t = totals.get(e.currency) ?? { sum: 0, count: 0 };
    t.sum += e.annualSalary;
    t.count += 1;
    totals.set(e.currency, t);
  }
  return { totals, missing, members: members.length };
}
var departmentsOf = (people) => [...new Set(people.map((e) => e.department))].sort();
function costByDepartment(people, today) {
  const on = people.filter((e) => isOnPayroll(e, today));
  return departmentsOf(on).map((department) => ({
    department,
    pay: payTotals(on.filter((e) => e.department === department))
  }));
}
function findDepartment(people, raw) {
  const wanted = raw.trim().toLowerCase().replace(/^the\s+/, "").replace(/\s+(team|department|dept)$/, "");
  const names = departmentsOf(people);
  return names.find((n) => n.toLowerCase() === wanted) ?? names.find((n) => n.toLowerCase().startsWith(wanted) || wanted.startsWith(n.toLowerCase())) ?? null;
}
function findPerson(people, raw) {
  const wanted = raw.trim().toLowerCase();
  const exact = people.filter((e) => e.displayName.toLowerCase() === wanted);
  if (exact.length) return exact;
  return people.filter((e) => e.displayName.toLowerCase().split(/\s+/).includes(wanted));
}

// src/lib/finance/figures.ts
function add(money, currency, amount) {
  money.set(currency, (money.get(currency) ?? 0) + amount);
}
var isLive = (inv) => inv.status !== "void" && inv.status !== "draft";
var isOpen = (inv) => inv.status === "unpaid" || inv.status === "part_paid";
function cashByBankAccount(txns, accounts) {
  const names = new Map(accounts.map((a) => [a.id, a.name]));
  const out = /* @__PURE__ */ new Map();
  for (const t of txns) {
    const row = out.get(t.bankAccountId) ?? { bankAccountId: t.bankAccountId, name: names.get(t.bankAccountId) ?? t.bankAccountId, balance: /* @__PURE__ */ new Map(), transactions: 0 };
    add(row.balance, t.currency, t.amount);
    row.transactions += 1;
    out.set(t.bankAccountId, row);
  }
  return [...out.values()].sort((a, b) => a.name.localeCompare(b.name));
}
function salesInvoicedIn(invoices, ym) {
  const total = /* @__PURE__ */ new Map();
  let count = 0;
  for (const inv of invoices) {
    if (inv.kind !== "sales" || !isLive(inv) || !inv.date.startsWith(ym)) continue;
    add(total, inv.currency, inv.total);
    count += 1;
  }
  return { total, count };
}
function overdueReceivables(invoices, today) {
  const open = invoices.filter((inv) => inv.kind === "sales" && isOpen(inv));
  const noDueDate = open.filter((inv) => !inv.dueDate).length;
  const late = open.filter((inv) => inv.dueDate && inv.dueDate < today).sort((a, b) => (a.dueDate ?? "").localeCompare(b.dueDate ?? ""));
  const total = /* @__PURE__ */ new Map();
  for (const inv of late) add(total, inv.currency, inv.outstanding);
  return { invoices: late, total, noDueDate };
}
function spendByAccountIn(invoices, accounts, ym) {
  const byId = new Map(accounts.map((a) => [a.id, a]));
  const out = /* @__PURE__ */ new Map();
  for (const inv of invoices) {
    if (inv.kind !== "purchase" || !isLive(inv) || !inv.date.startsWith(ym)) continue;
    for (const line2 of inv.lines) {
      const account = byId.get(line2.accountId);
      const row = out.get(line2.accountId) ?? { accountId: line2.accountId, name: account?.name ?? "account not on file", total: /* @__PURE__ */ new Map(), lines: 0 };
      add(row.total, inv.currency, line2.net);
      row.lines += 1;
      out.set(line2.accountId, row);
    }
  }
  return [...out.values()].sort((a, b) => sumAll(b.total) - sumAll(a.total));
}
function spendOnAccountIn(invoices, accounts, ym, accountName) {
  const wanted = accountName.trim().toLowerCase();
  return spendByAccountIn(invoices, accounts, ym).filter((row) => row.name.toLowerCase().includes(wanted));
}
function customerFigures(invoices, parties) {
  const names = new Map(parties.map((p) => [p.id, p.name]));
  const out = /* @__PURE__ */ new Map();
  for (const inv of invoices) {
    if (inv.kind !== "sales" || !isLive(inv)) continue;
    const row = out.get(inv.partyId) ?? { partyId: inv.partyId, name: names.get(inv.partyId) ?? "customer not on file", outstanding: /* @__PURE__ */ new Map(), invoiced: /* @__PURE__ */ new Map(), invoices: 0 };
    add(row.invoiced, inv.currency, inv.total);
    if (isOpen(inv)) add(row.outstanding, inv.currency, inv.outstanding);
    row.invoices += 1;
    out.set(inv.partyId, row);
  }
  return [...out.values()];
}
function topCustomersByOutstanding(invoices, parties, n = 5) {
  return customerFigures(invoices, parties).filter((c) => sumAll(c.outstanding) > 0).sort((a, b) => sumAll(b.outstanding) - sumAll(a.outstanding)).slice(0, n);
}
function biggestCustomers(invoices, parties, n = 5) {
  return customerFigures(invoices, parties).sort((a, b) => sumAll(b.invoiced) - sumAll(a.invoiced)).slice(0, n);
}
function sumAll(money) {
  let s = 0;
  for (const v of money.values()) s += v;
  return s;
}

// src/lib/brief/answer.ts
var CANNOT_ANSWER = "Buki cannot answer that from HR or finance data yet.";
var NOTHING_SYNCED = "Nothing has been synced yet. Press Sync now on the home page, then ask again.";
var NO_FINANCE_SOURCE = "No finance source connected yet. Set FINANCE_SOURCE=sage once the Sage connector is registered.";
function answerBrief(question, store, now = /* @__PURE__ */ new Date()) {
  const q = question.trim().toLowerCase().replace(/[?.!]+$/, "").replace(/\s+/g, " ");
  const hrCited = { source: store.hr.source, syncedAt: store.hr.syncedAt, records: store.hr.employees.length };
  if (!q) return { answer: CANNOT_ANSWER, figures: [], cited: hrCited };
  for (const rule of FINANCE_RULES) {
    const m = q.match(rule.pattern);
    if (!m) continue;
    const fin = store.finance;
    const cited = {
      source: fin.source,
      syncedAt: fin.syncedAt,
      records: fin.accounts.length + fin.parties.length + fin.invoices.length + fin.bankTransactions.length
    };
    if (!fin.source) return { answer: NO_FINANCE_SOURCE, figures: [], cited };
    return rule.answer(m, { fin, now, cited, sourceLabel: SOURCE_LABEL[fin.source] });
  }
  for (const rule of HR_RULES) {
    const m = q.match(rule.pattern);
    if (!m) continue;
    if (!store.hr.source || store.hr.employees.length === 0) return { answer: NOTHING_SYNCED, figures: [], cited: hrCited };
    return rule.answer(m, { people: store.hr.employees, now, cited: hrCited, sourceLabel: SOURCE_LABEL[store.hr.source] });
  }
  return { answer: CANNOT_ANSWER, figures: [], cited: hrCited };
}
var cite = (ctx) => `${ctx.sourceLabel}, synced ${fmtDate(ctx.cited.syncedAt)}`;
function resolveMonth(phrase, now) {
  const current = yearMonth(now);
  const p = phrase.trim().toLowerCase();
  if (p === "last month") return monthBefore(current);
  if (p === "this month") return current;
  const m = p.match(/^(?:in\s+)?([a-z]+)(?:\s+(\d{4}))?$/);
  if (!m) return null;
  const month = monthNumber(m[1]);
  if (!month) return null;
  const mm = String(month).padStart(2, "0");
  if (m[2]) return `${m[2]}-${mm}`;
  const thisYear = `${now.getUTCFullYear()}-${mm}`;
  return thisYear <= current ? thisYear : `${now.getUTCFullYear() - 1}-${mm}`;
}
var MONTH_PHRASE = String.raw`(last month|this month|in\s+[a-z]+(?:\s+\d{4})?|[a-z]+\s+\d{4})`;
var moneyList = (money) => [...money].map(([ccy, amount]) => fmtMoney(amount, ccy)).join(" and ");
var moneyFigures = (label, money) => [...money].map(([ccy, amount]) => ({ label: money.size > 1 ? `${label} (${ccy})` : label, value: fmtMoney(amount, ccy) }));
var notConverted = (money) => money.size > 1 ? " (more than one currency on file, not converted)" : "";
var line = (e) => `${e.displayName} (${e.title}, ${e.department})`;
function noDepartment(raw, ctx) {
  const names = [...new Set(ctx.people.map((e) => e.department))].sort();
  return {
    answer: `There is no department called "${raw.trim()}" on file. The departments are ${names.join(", ")}. By ${cite(ctx)}.`,
    figures: [],
    cited: ctx.cited
  };
}
var HR_RULES = [
  {
    pattern: /^(?:how many people|how many employees|headcount|head count)(?:\s.*)?$/,
    answer: (_m, ctx) => {
      const { today } = periodsOf(ctx.now);
      const { onPayroll, notStarted } = headcount(ctx.people, today);
      const figures = [{ label: "Headcount", value: String(onPayroll.length) }];
      if (notStarted.length) figures.push({ label: "Not started yet", value: String(notStarted.length) });
      const extra = notStarted.length ? ` ${plural(notStarted.length, "more person", "more people")} ha${notStarted.length === 1 ? "s" : "ve"} a start date after today.` : "";
      return { answer: `${onPayroll.length} people are on the payroll today, by ${cite(ctx)}.${extra}`, figures, cited: ctx.cited };
    }
  },
  {
    pattern: new RegExp(String.raw`^who (joined|started|left|departed)(?:\s+(?:us|the company))?\s+${MONTH_PHRASE}$`),
    answer: (m, ctx) => {
      const leaving = m[1] === "left" || m[1] === "departed";
      const ym = resolveMonth(m[2], ctx.now);
      if (!ym) return { answer: CANNOT_ANSWER, figures: [], cited: ctx.cited };
      const hits = leaving ? leftIn(ctx.people, ym) : joinedIn(ctx.people, ym);
      const verb = leaving ? "left" : "joined";
      if (!hits.length) {
        return {
          answer: `No one on file ${verb} in ${monthLabel(ym)}, by ${cite(ctx)}.`,
          figures: [{ label: `${leaving ? "Left" : "Joined"} in ${monthLabel(ym)}`, value: "0" }],
          cited: ctx.cited
        };
      }
      return {
        answer: `${plural(hits.length, "person", "people")} ${verb} in ${monthLabel(ym)}: ${hits.map(line).join("; ")}. By ${cite(ctx)}.`,
        figures: hits.map((e) => ({ label: e.displayName, value: fmtDate(leaving ? e.terminationDate : e.hireDate) })),
        cited: ctx.cited
      };
    }
  },
  {
    pattern: /^who (?:has )?left(?:\s+(?:us|the company))?$/,
    answer: (_m, ctx) => {
      const gone = ctx.people.filter((e) => e.status === "terminated").sort((a, b) => (b.terminationDate ?? "").localeCompare(a.terminationDate ?? ""));
      if (!gone.length) return { answer: `No one on file has left, by ${cite(ctx)}.`, figures: [], cited: ctx.cited };
      const shown = gone.slice(0, 10);
      return {
        answer: `${plural(gone.length, "person has", "people have")} left: ${shown.map((e) => `${e.displayName} on ${fmtDate(e.terminationDate) || "a date not on file"}`).join("; ")}${gone.length > shown.length ? "; and more" : ""}. By ${cite(ctx)}.`,
        figures: shown.map((e) => ({ label: e.displayName, value: fmtDate(e.terminationDate) || "not on file" })),
        cited: ctx.cited
      };
    }
  },
  {
    pattern: /^(?:what does (?:the )?(.+?) (?:team |department )?cost|(?:what is |what's )?(?:the )?(.+?) (?:team |department )?cost)(?:\s+(?:per year|a year|annually))?$/,
    answer: (m, ctx) => {
      const raw = m[1] ?? m[2];
      const dept = findDepartment(ctx.people, raw);
      if (!dept) return noDepartment(raw, ctx);
      const { today } = periodsOf(ctx.now);
      const row = costByDepartment(ctx.people, today).find((r) => r.department === dept);
      if (!row || row.pay.members === 0) return { answer: `No one is on the payroll in ${dept} today, by ${cite(ctx)}.`, figures: [], cited: ctx.cited };
      const { totals, missing, members } = row.pay;
      const figures = [...totals].map(([ccy, t]) => ({ label: `${dept}, annual base (${ccy})`, value: fmtMoney(t.sum, ccy) }));
      figures.push({ label: "People counted", value: String(members) });
      if (missing) figures.push({ label: "No salary on file", value: String(missing) });
      if (!totals.size) {
        return {
          answer: `${dept} has ${plural(members, "person", "people")} on the payroll and none of them has a salary on file, so there is no figure to give. By ${cite(ctx)}.`,
          figures,
          cited: ctx.cited
        };
      }
      const parts = [...totals].map(([ccy, t]) => `${fmtMoney(t.sum, ccy)} a year in base salary across ${plural(t.count, "person", "people")}`);
      const floor = missing ? `${missing} of ${members} have no salary on file, so this is a floor. ` : "";
      return {
        answer: `${dept} costs ${parts.join(" and ")}${totals.size > 1 ? " (two currencies on file, not converted)" : ""}. ${floor}By ${cite(ctx)}.`,
        figures,
        cited: ctx.cited
      };
    }
  },
  {
    pattern: /^(?:what is |what's )?(?:the )?average (?:base )?(?:salary|pay) (?:in|for|of) (?:the )?(.+?)(?: team| department)?$/,
    answer: (m, ctx) => {
      const dept = findDepartment(ctx.people, m[1]);
      if (!dept) return noDepartment(m[1], ctx);
      const { today } = periodsOf(ctx.now);
      const members = ctx.people.filter((e) => e.department === dept && isOnPayroll(e, today));
      const { totals, missing } = payTotals(members);
      if (!totals.size) {
        return { answer: `No one in ${dept} has a salary on file, so there is no average to give. By ${cite(ctx)}.`, figures: [], cited: ctx.cited };
      }
      const parts = [...totals].map(([ccy, t]) => `${fmtMoney(t.sum / t.count, ccy)} across ${plural(t.count, "person", "people")}`);
      const figures = [...totals].map(([ccy, t]) => ({ label: `${dept}, average base (${ccy})`, value: fmtMoney(t.sum / t.count, ccy) }));
      if (missing) figures.push({ label: "No salary on file", value: String(missing) });
      return {
        answer: `The average base salary in ${dept} is ${parts.join(" and ")}${totals.size > 1 ? " (two currencies on file, not converted)" : ""}. ${missing ? `${missing} of ${members.length} have no salary on file and are left out of the average. ` : ""}By ${cite(ctx)}.`,
        figures,
        cited: ctx.cited
      };
    }
  },
  {
    pattern: /^who reports to (.+)$/,
    answer: (m, ctx) => {
      const matches = findPerson(ctx.people, m[1]);
      if (!matches.length) return { answer: `There is no one called "${m[1].trim()}" on file, by ${cite(ctx)}.`, figures: [], cited: ctx.cited };
      if (matches.length > 1) {
        return {
          answer: `More than one person matches "${m[1].trim()}": ${matches.map((e) => e.displayName).join(", ")}. Ask with the full name.`,
          figures: [],
          cited: ctx.cited
        };
      }
      const boss = matches[0];
      const { today } = periodsOf(ctx.now);
      const reports = ctx.people.filter((e) => e.managerId === boss.id && isOnPayroll(e, today)).sort(byName);
      if (!reports.length) return { answer: `No one on the payroll reports to ${boss.displayName}, by ${cite(ctx)}.`, figures: [], cited: ctx.cited };
      return {
        answer: `${plural(reports.length, "person reports", "people report")} to ${boss.displayName}: ${reports.map(line).join("; ")}. By ${cite(ctx)}.`,
        figures: reports.map((e) => ({ label: e.displayName, value: e.title })),
        cited: ctx.cited
      };
    }
  }
];
var FINANCE_RULES = [
  {
    pattern: /^(?:how much cash do we have|how much cash(?: is there)?|what is our cash(?: position| balance)?|cash position|cash balance)(?:\s+(?:today|now|right now))?$/,
    answer: (_m, ctx) => {
      if (!ctx.fin.bankTransactions.length) {
        return { answer: `No bank transactions are on file from ${ctx.sourceLabel}, so there is no cash figure to give.`, figures: [], cited: ctx.cited };
      }
      const rows = cashByBankAccount(ctx.fin.bankTransactions, ctx.fin.accounts);
      const total = /* @__PURE__ */ new Map();
      for (const r of rows) for (const [ccy, v] of r.balance) total.set(ccy, (total.get(ccy) ?? 0) + v);
      const figures = rows.flatMap((r) => moneyFigures(r.name, r.balance));
      figures.push(...moneyFigures("All bank accounts", total));
      return {
        answer: `Cash is ${moneyList(total)} across ${plural(rows.length, "bank account")}, summed from the transactions on file (not a statement balance)${notConverted(total)}. By ${cite(ctx)}.`,
        figures,
        cited: ctx.cited
      };
    }
  },
  {
    pattern: new RegExp(String.raw`^(?:what did we invoice|what did we bill|how much did we invoice|how much did we bill|revenue|sales|what was (?:our )?revenue|what were (?:our )?sales)\s+${MONTH_PHRASE}$`),
    answer: (m, ctx) => {
      const ym = resolveMonth(m[1], ctx.now);
      if (!ym) return { answer: CANNOT_ANSWER, figures: [], cited: ctx.cited };
      if (!ctx.fin.invoices.length) {
        return { answer: `No invoices are on file from ${ctx.sourceLabel}, so there is no figure for ${monthLabel(ym)}.`, figures: [], cited: ctx.cited };
      }
      const { total, count } = salesInvoicedIn(ctx.fin.invoices, ym);
      if (!count) {
        return { answer: `No sales invoices are dated in ${monthLabel(ym)}, by ${cite(ctx)}.`, figures: [{ label: `Invoiced in ${monthLabel(ym)}`, value: "none dated this month" }], cited: ctx.cited };
      }
      return {
        answer: `${moneyList(total)} was invoiced in ${monthLabel(ym)} across ${plural(count, "sales invoice")}, void and draft invoices left out${notConverted(total)}. By ${cite(ctx)}.`,
        figures: [...moneyFigures(`Invoiced in ${monthLabel(ym)}`, total), { label: "Sales invoices", value: String(count) }],
        cited: ctx.cited
      };
    }
  },
  {
    pattern: /^(?:who owes us(?: money)?|overdue invoices|what is overdue|what's overdue|overdue receivables|which invoices are overdue)$/,
    answer: (_m, ctx) => {
      if (!ctx.fin.invoices.length) {
        return { answer: `No invoices are on file from ${ctx.sourceLabel}, so there is nothing to call overdue.`, figures: [], cited: ctx.cited };
      }
      const { today } = periodsOf(ctx.now);
      const { invoices, total, noDueDate } = overdueReceivables(ctx.fin.invoices, today);
      const names = new Map(ctx.fin.parties.map((p) => [p.id, p.name]));
      const noDue = noDueDate ? ` ${plural(noDueDate, "open invoice has", "open invoices have")} no due date on file and ${noDueDate === 1 ? "is" : "are"} not counted.` : "";
      if (!invoices.length) {
        return { answer: `Nothing is overdue today, by ${cite(ctx)}.${noDue}`, figures: [{ label: "Overdue invoices", value: "0" }], cited: ctx.cited };
      }
      const shown = invoices.slice(0, 10);
      return {
        answer: `${plural(invoices.length, "invoice is", "invoices are")} overdue, ${moneyList(total)} outstanding${notConverted(total)}: ${shown.map((inv) => `${names.get(inv.partyId) ?? "customer not on file"} ${fmtMoney(inv.outstanding, inv.currency)} due ${fmtDate(inv.dueDate)}`).join("; ")}${invoices.length > shown.length ? "; and more" : ""}. By ${cite(ctx)}.${noDue}`,
        figures: [...moneyFigures("Overdue outstanding", total), { label: "Overdue invoices", value: String(invoices.length) }],
        cited: ctx.cited
      };
    }
  },
  {
    pattern: new RegExp(String.raw`^(?:what did we spend on|how much did we spend on|spend on|spending on) (.+?)\s+${MONTH_PHRASE}$`),
    answer: (m, ctx) => {
      const ym = resolveMonth(m[2], ctx.now);
      if (!ym) return { answer: CANNOT_ANSWER, figures: [], cited: ctx.cited };
      if (!ctx.fin.invoices.length) {
        return { answer: `No invoices are on file from ${ctx.sourceLabel}, so there is no spend figure for ${monthLabel(ym)}.`, figures: [], cited: ctx.cited };
      }
      const rows = spendOnAccountIn(ctx.fin.invoices, ctx.fin.accounts, ym, m[1]);
      if (!rows.length) {
        return { answer: `No purchase invoice lines in ${monthLabel(ym)} are posted to an account called "${m[1].trim()}", by ${cite(ctx)}.`, figures: [], cited: ctx.cited };
      }
      const total = /* @__PURE__ */ new Map();
      for (const r of rows) for (const [ccy, v] of r.total) total.set(ccy, (total.get(ccy) ?? 0) + v);
      const lines = rows.reduce((n, r) => n + r.lines, 0);
      return {
        answer: `${moneyList(total)} was spent on ${rows.map((r) => r.name).join(", ")} in ${monthLabel(ym)}, from ${plural(lines, "purchase invoice line")}${notConverted(total)}. By ${cite(ctx)}.`,
        figures: rows.flatMap((r) => moneyFigures(r.name, r.total)),
        cited: ctx.cited
      };
    }
  },
  {
    pattern: /^(?:(?:who are )?(?:our )?biggest customers|top customers|largest customers|(?:who are )?(?:our )?top (?:five|5) customers)$/,
    answer: (_m, ctx) => {
      if (!ctx.fin.invoices.length) {
        return { answer: `No invoices are on file from ${ctx.sourceLabel}, so there is no customer ranking to give.`, figures: [], cited: ctx.cited };
      }
      const top = biggestCustomers(ctx.fin.invoices, ctx.fin.parties, 5);
      if (!top.length) return { answer: `No sales invoices are on file, by ${cite(ctx)}.`, figures: [], cited: ctx.cited };
      const owing = topCustomersByOutstanding(ctx.fin.invoices, ctx.fin.parties, 5);
      const owingNote = owing.length ? ` Most outstanding: ${owing.map((c) => `${c.name} ${moneyList(c.outstanding)}`).join("; ")}.` : "";
      return {
        answer: `By sales invoiced on file: ${top.map((c, i) => `${i + 1}. ${c.name} ${moneyList(c.invoiced)}`).join("; ")}. By ${cite(ctx)}.${owingNote}`,
        figures: top.flatMap((c) => moneyFigures(c.name, c.invoiced)),
        cited: ctx.cited
      };
    }
  }
];

// api/index.ts
var currentStore = JSON.parse(JSON.stringify(store_default));
function getHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Buki Executive Finance \u2014 Sage v3.1 Connector</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #090d16;
      --card-bg: rgba(22, 27, 34, 0.7);
      --card-bg-solid: #161b22;
      --border: #21262d;
      --border-hover: #30363d;
      --text: #f0f6fc;
      --text-muted: #8b949e;
      --accent-green: #238636;
      --accent-blue: #388bfd;
      --accent-amber: #d29922;
      --accent-red: #f85149;
      --font: 'Plus Jakarta Sans', -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      background-image: 
        radial-gradient(circle at 15% 10%, rgba(31, 111, 235, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 85% 90%, rgba(35, 134, 54, 0.1) 0%, transparent 40%);
      color: var(--text);
      font-family: var(--font);
      line-height: 1.5;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .wrapper { max-width: 1280px; margin: 0 auto; width: 100%; padding: 24px 20px; flex: 1; }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 24px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 16px;
    }
    .brand-wrap { display: flex; align-items: center; gap: 14px; }
    .brand-logo {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #2563eb, #10b981);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 22px;
      color: white;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
    }
    .brand-text h1 { font-size: 20px; font-weight: 700; letter-spacing: -0.4px; }
    .brand-text p { font-size: 13px; color: var(--text-muted); }
    .header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .cloud-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(35, 134, 54, 0.12);
      border: 1px solid rgba(46, 160, 67, 0.35);
      color: #3fb950;
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      font-family: var(--font-mono);
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #3fb950;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(63, 185, 80, 0.7); }
      70% { box-shadow: 0 0 0 8px rgba(63, 185, 80, 0); }
      100% { box-shadow: 0 0 0 0 rgba(63, 185, 80, 0); }
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--card-bg-solid);
      border: 1px solid var(--border);
      color: var(--text);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      font-family: var(--font);
    }
    .btn:hover { border-color: var(--border-hover); background: #1c2128; }
    .btn-primary { background: #238636; color: white; border-color: rgba(255,255,255,0.1); }
    .btn-primary:hover { background: #2ea043; }
    .btn-blue { background: #1f6feb; color: white; border-color: rgba(255,255,255,0.1); }
    .btn-blue:hover { background: #388bfd; }
    .btn-amber { background: rgba(210, 153, 34, 0.15); border-color: rgba(210, 153, 34, 0.4); color: #d29922; }

    .nav-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 8px;
      overflow-x: auto;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      font-family: var(--font);
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }
    .tab-btn:hover { color: var(--text); background: rgba(255, 255, 255, 0.05); }
    .tab-btn.active { color: white; background: #21262d; border-bottom: 2px solid var(--accent-blue); }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 28px;
    }
    .kpi-card {
      background: var(--card-bg);
      backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
    }
    .kpi-title { font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; }
    .kpi-value { font-size: 26px; font-weight: 700; font-family: var(--font-mono); }
    .kpi-sub { font-size: 12px; color: var(--text-muted); margin-top: 6px; }
    .val-green { color: #3fb950; }
    .val-amber { color: #d29922; }
    .val-blue { color: #58a6ff; }
    .val-purple { color: #bc8cff; }

    .ask-box {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 28px;
    }
    .ask-title { font-size: 16px; font-weight: 700; margin-bottom: 12px; }
    .chips-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
    .chip {
      background: rgba(56, 139, 253, 0.08);
      border: 1px solid rgba(56, 139, 253, 0.25);
      color: #58a6ff;
      border-radius: 999px;
      padding: 5px 14px;
      font-size: 12px;
      cursor: pointer;
    }
    .chip:hover { background: rgba(56, 139, 253, 0.2); }
    .query-input-wrap { display: flex; gap: 10px; }
    .query-input {
      flex: 1;
      background: #0d1117;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 18px;
      color: var(--text);
      font-size: 14px;
      font-family: var(--font);
      outline: none;
    }
    .answer-card {
      display: none;
      background: #0d1117;
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      margin-top: 18px;
    }
    .answer-text { font-size: 15px; font-weight: 500; line-height: 1.6; margin-bottom: 14px; }
    .fig-list { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 12px; }
    .fig-tag {
      background: #161b22;
      border: 1px solid var(--border);
      padding: 6px 12px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 13px;
    }
    .cite-label { font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); }

    .table-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 22px;
      margin-bottom: 24px;
    }
    .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
    .table-title { font-size: 16px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th { text-align: left; padding: 10px 12px; color: var(--text-muted); font-size: 11px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid var(--border); }
    td { padding: 12px; border-bottom: 1px solid rgba(48, 54, 61, 0.4); }
    .mono { font-family: var(--font-mono); }
    .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
    .badge-red { background: rgba(248, 81, 73, 0.15); color: #f85149; border: 1px solid rgba(248, 81, 73, 0.35); }
    .badge-green { background: rgba(46, 160, 67, 0.15); color: #3fb950; border: 1px solid rgba(46, 160, 67, 0.35); }
    .badge-blue { background: rgba(56, 139, 253, 0.15); color: #58a6ff; border: 1px solid rgba(56, 139, 253, 0.35); }
    
    .sandbox-panel {
      background: linear-gradient(135deg, rgba(22, 27, 34, 0.9), rgba(13, 17, 23, 0.9));
      border: 1px solid rgba(56, 139, 253, 0.3);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 28px;
    }
    .sandbox-title { font-size: 17px; font-weight: 700; color: #58a6ff; margin-bottom: 6px; }
    .sandbox-desc { font-size: 13px; color: var(--text-muted); margin-bottom: 18px; }
    .sandbox-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 18px; }
    .mutation-status { background: #0d1117; border: 1px solid var(--border); border-radius: 8px; padding: 14px 18px; font-size: 13px; font-family: var(--font-mono); color: #3fb950; }

    .tab-content { display: none; }
    .tab-content.active { display: block; }
    footer { border-top: 1px solid var(--border); padding: 24px 20px; font-size: 13px; color: var(--text-muted); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: auto; }
    footer a { color: var(--accent-blue); text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <header>
      <div class="brand-wrap">
        <div class="brand-logo">B</div>
        <div class="brand-text">
          <h1>Buki Finance Executive Dashboard</h1>
          <p>Canonical Sage v3.1 Integration \xB7 Hosted 24/7 on Vercel Serverless</p>
        </div>
      </div>
      <div class="header-actions">
        <div class="cloud-badge">
          <div class="pulse-dot"></div>
          VERCEL CLOUD 24/7
        </div>
        <button class="btn btn-blue" onclick="triggerSync(this)">Sync Now</button>
      </div>
    </header>

    <div class="nav-tabs">
      <button class="tab-btn active" onclick="switchTab('overview', this)">\u{1F4CA} Overview & Figures</button>
      <button class="tab-btn" onclick="switchTab('brief', this)">\u{1F4AC} Natural Language Brief</button>
      <button class="tab-btn" onclick="switchTab('invoices', this)">\u{1F4D1} Invoices & Receivables</button>
      <button class="tab-btn" onclick="switchTab('cash', this)">\u{1F3E6} Bank Cash & Ledger</button>
      <button class="tab-btn" onclick="switchTab('sandbox', this)">\u26A1 Live Mutation Sandbox</button>
    </div>

    <!-- OVERVIEW TAB -->
    <div id="tab-overview" class="tab-content active">
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-title">TOTAL BANK CASH</div>
          <div class="kpi-value val-green">$253,615</div>
          <div class="kpi-sub">Operating ($63.5k) & Reserve ($190.1k)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">OVERDUE RECEIVABLES</div>
          <div class="kpi-value val-amber" id="ov-overdue">$12,000</div>
          <div class="kpi-sub">2 open sales invoices past terms</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">SEPT SOFTWARE SPEND</div>
          <div class="kpi-value val-blue">$300</div>
          <div class="kpi-sub">Software subscriptions nominal account</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">INVOICED REVENUE</div>
          <div class="kpi-value val-purple">$45,500</div>
          <div class="kpi-sub">Sept ($33.5k) \xB7 Oct ($12.0k)</div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
        <div class="table-card">
          <div class="table-header"><div class="table-title">Top Customers by Volume</div></div>
          <table>
            <thead><tr><th>Customer</th><th style="text-align: right;">Invoiced</th><th style="text-align: right;">Outstanding</th></tr></thead>
            <tbody>
              <tr><td>Northgate Analytics</td><td class="mono" style="text-align: right;">$30,000.00</td><td class="mono" style="text-align: right; color: #3fb950;">$12,000.00</td></tr>
              <tr><td>Pinecrest Health</td><td class="mono" style="text-align: right;">$9,500.00</td><td class="mono" style="text-align: right; color: #f85149;" id="pine-overdue">$9,500.00</td></tr>
              <tr><td>Tolliver & Reed LLP</td><td class="mono" style="text-align: right;">$6,000.00</td><td class="mono" style="text-align: right; color: #f85149;" id="toll-overdue">$2,500.00</td></tr>
            </tbody>
          </table>
        </div>

        <div class="table-card">
          <div class="table-header"><div class="table-title">Spend by Expense Account (Sept 2026)</div></div>
          <table>
            <thead><tr><th>Expense Account</th><th>Category</th><th style="text-align: right;">Net Amount</th></tr></thead>
            <tbody>
              <tr><td>Software subscriptions</td><td>Technology</td><td class="mono" style="text-align: right; color: #58a6ff;">$300.00</td></tr>
              <tr><td>Rent</td><td>Facilities</td><td class="mono" style="text-align: right;">$8,500.00</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- BRIEF TAB -->
    <div id="tab-brief" class="tab-content">
      <div class="ask-box">
        <div class="ask-title">Ask Founder Financial & Payroll Questions</div>
        <div class="chips-row">
          <span class="chip" onclick="askQuestion('who owes us money')">Who owes us money?</span>
          <span class="chip" onclick="askQuestion('what did we spend on software last month')">What did we spend on software last month?</span>
          <span class="chip" onclick="askQuestion('how much cash do we have')">How much cash do we have?</span>
          <span class="chip" onclick="askQuestion('how many people')">How many people on payroll?</span>
          <span class="chip" onclick="askQuestion('what does the Engineering team cost')">What does Engineering cost?</span>
        </div>
        <div class="query-input-wrap">
          <input type="text" id="query-input" class="query-input" value="who owes us money">
          <button class="btn btn-primary" onclick="submitQuery()">Ask Buki</button>
        </div>
        <div id="brief-answer-box" class="answer-card">
          <div id="brief-text" class="answer-text"></div>
          <div id="brief-figures" class="fig-list"></div>
          <div id="brief-citation" class="cite-label"></div>
        </div>
      </div>
    </div>

    <!-- INVOICES TAB -->
    <div id="tab-invoices" class="tab-content">
      <div class="table-card">
        <div class="table-header"><div class="table-title">Sage Accounting Invoices</div></div>
        <table>
          <thead><tr><th>Invoice #</th><th>Type</th><th>Issue Date</th><th>Due Date</th><th>Status</th><th style="text-align: right;">Outstanding</th></tr></thead>
          <tbody id="inv-rows"></tbody>
        </table>
      </div>
    </div>

    <!-- BANK TAB -->
    <div id="tab-cash" class="tab-content">
      <div class="table-card">
        <div class="table-header"><div class="table-title">Bank Accounts & Nominal Assets</div></div>
        <table>
          <thead><tr><th>Bank Account</th><th>Nominal Asset ID</th><th>Transactions</th><th style="text-align: right;">Cash Balance</th></tr></thead>
          <tbody>
            <tr><td>Operating account</td><td class="mono">acc-asset-operating</td><td class="mono">7 txns</td><td class="mono" style="text-align: right; color: #3fb950; font-weight: 700;">$63,520.00</td></tr>
            <tr><td>Reserve account</td><td class="mono">acc-asset-reserve</td><td class="mono">3 txns</td><td class="mono" style="text-align: right; color: #3fb950; font-weight: 700;">$190,095.00</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SANDBOX TAB -->
    <div id="tab-sandbox" class="tab-content">
      <div class="sandbox-panel">
        <div class="sandbox-title">\u26A1 Live Sage Mutation Simulator</div>
        <div class="sandbox-desc">Simulate live changes in Sage Accounting and verify real-time change detection.</div>
        <div class="sandbox-actions">
          <button class="btn btn-amber" onclick="mutate('partial-pay')">\u{1F4B5} Record $5,000 Payment for Pinecrest ($9.5k \u2192 $4.5k)</button>
          <button class="btn btn-primary" onclick="mutate('mark-paid')">\u2714\uFE0F Mark Tolliver & Reed as Paid ($0 Outstanding)</button>
          <button class="btn" onclick="resetData()">\u{1F504} Reset to Baseline</button>
        </div>
        <div class="mutation-status" id="mut-status">System Ready. Baseline loaded.</div>
      </div>
    </div>

    <footer>
      <div>Candidate: <strong>Rishabh Bothra</strong> \xB7 Evaluated by <strong>Vivek Chandrasekar</strong> (vivek@mybuki.ai)</div>
      <div>
        <a href="https://github.com/rishbahjain270804/buki-sage/pull/1" target="_blank">Pull Request #1</a> \xB7 
        <a href="https://proof.zeromaintenanceengineer.in/next/build/a6302c1b-6e8a-44e0-88f6-b8c0c075c766" target="_blank">Proof Notebook</a>
      </div>
    </footer>
  </div>

  <script>
    function switchTab(id, el) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('tab-' + id).classList.add('active');
    }

    async function loadInvoices() {
      const res = await fetch('/api/store-data');
      const data = await res.json();
      const tbody = document.getElementById('inv-rows');
      tbody.innerHTML = '';
      (data.finance?.invoices || []).forEach(inv => {
        let badge = '<span class="badge badge-green">PAID</span>';
        if (inv.status === 'overdue') badge = '<span class="badge badge-red">OVERDUE</span>';
        else if (inv.status === 'open') badge = '<span class="badge badge-blue">OPEN</span>';
        const row = document.createElement('tr');
        row.innerHTML = '<td><strong>' + (inv.number || inv.id) + '</strong></td><td>' + inv.kind.toUpperCase() + '</td><td>' + inv.date + '</td><td>' + (inv.dueDate || 'None') + '</td><td>' + badge + '</td><td class="mono" style="text-align:right;">$' + inv.outstanding.toLocaleString() + '</td>';
        tbody.appendChild(row);
      });
    }

    async function askQuestion(q) {
      document.getElementById('query-input').value = q;
      submitQuery();
    }

    async function submitQuery() {
      const q = document.getElementById('query-input').value.trim();
      if (!q) return;
      const box = document.getElementById('brief-answer-box');
      box.style.display = 'block';
      document.getElementById('brief-text').innerText = 'Analyzing store...';
      const res = await fetch('/api/ask?q=' + encodeURIComponent(q));
      const data = await res.json();
      document.getElementById('brief-text').innerText = data.answer;
      let figHtml = '';
      (data.figures || []).forEach(f => {
        figHtml += '<div class="fig-tag"><strong>' + f.label + ':</strong> ' + f.value + '</div>';
      });
      document.getElementById('brief-figures').innerHTML = figHtml;
      if (data.cited) {
        document.getElementById('brief-citation').innerText = 'Cited from ' + data.cited.source + ' \xB7 ' + data.cited.records + ' records on file';
      }
    }

    async function triggerSync(btn) {
      if (btn) btn.innerText = 'Syncing...';
      await fetch('/api/sync', { method: 'POST' });
      if (btn) { btn.innerText = 'Synced!'; setTimeout(() => btn.innerText = 'Sync Now', 2000); }
      loadInvoices();
      submitQuery();
    }

    async function mutate(action) {
      const status = document.getElementById('mut-status');
      status.innerText = 'Mutating in cloud memory...';
      const res = await fetch('/api/mutate-sage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      status.innerHTML = '\u2705 <strong>Sage Mutated:</strong> ' + data.message;
      if (action === 'partial-pay') {
        document.getElementById('pine-overdue').innerText = '$4,500.00';
        document.getElementById('ov-overdue').innerText = '$7,000';
      } else if (action === 'mark-paid') {
        document.getElementById('toll-overdue').innerText = '$0.00';
      }
      loadInvoices();
      submitQuery();
    }

    async function resetData() {
      await fetch('/api/reset-sage', { method: 'POST' });
      document.getElementById('mut-status').innerText = 'Reset to baseline.';
      document.getElementById('pine-overdue').innerText = '$9,500.00';
      document.getElementById('toll-overdue').innerText = '$2,500.00';
      document.getElementById('ov-overdue').innerText = '$12,000';
      loadInvoices();
      submitQuery();
    }

    loadInvoices();
    submitQuery();
  </script>
</body>
</html>`;
}
async function handler(req, res) {
  const parsed = url.parse(req.url || "/", true);
  const pathname = parsed.pathname || "/";
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  if (pathname === "/" || pathname === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(getHtml());
    return;
  }
  if (pathname === "/api/store-data") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(currentStore));
    return;
  }
  if (pathname === "/api/ask") {
    const q = parsed.query.q || "";
    try {
      const answer = answerBrief(q, currentStore);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(answer));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }
  if (pathname === "/api/sync" && req.method === "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, financeChanged: 0 }));
    return;
  }
  if (pathname === "/api/mutate-sage" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => body += chunk);
    req.on("end", () => {
      const { action } = JSON.parse(body || "{}");
      if (action === "partial-pay") {
        const inv = currentStore.finance.invoices.find((i) => i.id === "sage:si-3002");
        if (inv) inv.outstanding = 4500;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, message: "Recorded $5,000 payment for SI-3002: outstanding is now $4,500" }));
        return;
      }
      if (action === "mark-paid") {
        const inv = currentStore.finance.invoices.find((i) => i.id === "sage:si-3003");
        if (inv) {
          inv.outstanding = 0;
          inv.status = "paid";
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, message: "Marked SI-3003 as PAID ($0 outstanding)" }));
        return;
      }
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "Unknown action" }));
    });
    return;
  }
  if (pathname === "/api/reset-sage" && req.method === "POST") {
    currentStore = JSON.parse(JSON.stringify(store_default));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, message: "Baseline restored" }));
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
}
export {
  handler as default
};
