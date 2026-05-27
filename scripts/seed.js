// scripts/seed.js
// Seed the Valencia Verde Supabase database with realistic data.
// Usage: node scripts/seed.js

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://zaecnvkwbinuyqsxlpew.supabase.co';
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphZWNudmt3YmludXlxc3hscGV3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc1NTYzMywiZXhwIjoyMDk0MzMxNjMzfQ.4t4qH79-m_n4dTp_yFmblQIHqMbYGRbw8dxYXLiU-gM';

const ADMIN_ID = '13024a48-7027-4abc-821e-8364433d040b';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const REGULAR_USERS = [
  { first_name: 'Carlos', last_name: 'Mendoza',   national_id: '12345678', phone: '04141234567', email: 'carlos.mendoza@gmail.com' },
  { first_name: 'Luisa',  last_name: 'Herrera',   national_id: '23456789', phone: '04242345678', email: 'luisa.herrera@gmail.com' },
  { first_name: 'Miguel', last_name: 'Ramírez',   national_id: '34567890', phone: '04123456789', email: 'miguel.ramirez@gmail.com' },
  { first_name: 'Sofía',  last_name: 'Torres',    national_id: '45678901', phone: '04144567890', email: 'sofia.torres@gmail.com' },
  { first_name: 'Andrés', last_name: 'González',  national_id: '56789012', phone: '04245678901', email: 'andres.gonzalez@gmail.com' },
  { first_name: 'Valentina', last_name: 'Pérez',  national_id: '67890123', phone: '04126789012', email: 'valentina.perez@gmail.com' },
  { first_name: 'José',   last_name: 'Castillo',  national_id: '78901234', phone: '04147890123', email: 'jose.castillo@gmail.com' },
  { first_name: 'María',  last_name: 'Vargas',    national_id: '89012345', phone: '04248901234', email: 'maria.vargas@gmail.com' },
  { first_name: 'Ricardo', last_name: 'Díaz',     national_id: '90123456', phone: '04129012345', email: 'ricardo.diaz@gmail.com' },
  { first_name: 'Carmen', last_name: 'Morales',   national_id: '01234567', phone: '04140123456', email: 'carmen.morales@gmail.com' },
];

const CONTACTS = [
  {
    name: 'Bomberos de Valencia',
    phone: '02418574400',
    description: 'Cuerpo de Bomberos del Municipio Valencia. Atención de incendios y emergencias.',
  },
  {
    name: 'Protección Civil Carabobo',
    phone: '02418432211',
    description: 'Coordinación de Protección Civil del Estado Carabobo. Gestión de riesgos y desastres.',
  },
  {
    name: 'Cruz Roja Venezolana – Seccional Carabobo',
    phone: '02418215050',
    description: 'Atención de heridos, primeros auxilios y apoyo humanitario en emergencias.',
  },
  {
    name: 'Policía Nacional Bolivariana (PNB)',
    phone: '02414111',
    description: 'Cuerpo de Policía Nacional. Seguridad pública y apoyo en situaciones de riesgo.',
  },
  {
    name: 'CICPC – Delegación Carabobo',
    phone: '08002472472',
    description: 'Cuerpo de Investigaciones Científicas, Penales y Criminalísticas. Emergencias y delitos.',
  },
  {
    name: 'CORPOELEC – Valencia',
    phone: '08000278262',
    description: 'Corporación Eléctrica Nacional. Reporte de fallas eléctricas que puedan causar incendios.',
  },
];

// Valencia, Venezuela bounding box (approximate)
//   lat: 10.08 – 10.26  /  lng: -68.08 – -67.88
const NEIGHBORHOODS = [
  { name: 'El Trigal',       lat: 10.1900, lng: -67.9900 },
  { name: 'Prebo',           lat: 10.1620, lng: -67.9820 },
  { name: 'Flor Amarillo',   lat: 10.1480, lng: -68.0400 },
  { name: 'Las Acacias',     lat: 10.1720, lng: -67.9780 },
  { name: 'La Isabelica',    lat: 10.1320, lng: -68.0100 },
  { name: 'Naguanagua',      lat: 10.2230, lng: -68.0010 },
  { name: 'Los Guayos',      lat: 10.2000, lng: -67.9300 },
  { name: 'San José',        lat: 10.1600, lng: -67.9950 },
  { name: 'Michelena',       lat: 10.1450, lng: -67.9700 },
  { name: 'Bello Monte',     lat: 10.1780, lng: -67.9850 },
];

const REPORT_TYPES   = ['forest', 'urban', 'industrial', 'grassland', 'other'];
const PRIORITIES     = ['low', 'medium', 'high', 'critical'];
const STATUSES       = ['pending', 'in progress', 'done'];

// Realistic Spanish descriptions for each type
const DESCRIPTIONS = {
  forest: [
    'Se detectó un incendio forestal en el cerro al norte del sector. Las llamas avanzan rápidamente impulsadas por el viento.',
    'Columna de humo visible desde varios kilómetros. El fuego consume maleza y árboles secos en la ladera.',
    'Incendio forestal activo con riesgo de propagación hacia zonas residenciales cercanas. Se solicita intervención urgente.',
  ],
  urban: [
    'Incendio en vivienda unifamiliar. Las llamas se han extendido al techo y amenazan casas aledañas.',
    'Fuego en depósito de materiales inflamables dentro de zona residencial. Humo negro intenso visible.',
    'Incendio en local comercial del centro. Posibles personas atrapadas en el interior del edificio.',
  ],
  industrial: [
    'Incendio en galpón industrial de la zona este. Se desconoce si hay productos químicos almacenados.',
    'Explosión seguida de incendio en planta de procesamiento. Varios trabajadores evacuados con quemaduras.',
    'Fuego activo en depósito de combustible. Riesgo de explosión secundaria. Área en radio de 500 m evacuada.',
  ],
  grassland: [
    'Incendio de pastizales en terreno baldío. El fuego se propaga hacia viviendas en el límite del sector.',
    'Quema de sabana fuera de control. Las llamas avanzan hacia el colegio ubicado al sur del área afectada.',
    'Incendio de pastizal de gran extensión. Los vientos dificultan las labores de control.',
  ],
  other: [
    'Incendio de origen desconocido en lote de terreno. Se observan restos de materiales plásticos quemados.',
    'Foco de calor detectado por vecinos durante la madrugada. Se desconoce la causa del siniestro.',
    'Columna de humo reportada por múltiples residentes. No se puede determinar el tipo de incendio desde la distancia.',
  ],
};

const INJURED_DETAILS = [
  'Una persona con quemaduras en brazos trasladada al Hospital Central de Valencia.',
  'Dos heridos leves por inhalación de humo, atendidos en el lugar por paramédicos.',
  'Tres personas con quemaduras de segundo grado evacuadas al centro asistencial más cercano.',
  'Un trabajador con quemaduras en manos y rostro. Inconsciente al momento del reporte.',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomFloat(min, max, decimals = 6) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

/** Returns an ISO date string between `daysAgo` days ago and now. */
function randomDateWithinDays(daysAgo) {
  const now = Date.now();
  const past = now - daysAgo * 24 * 60 * 60 * 1000;
  return new Date(past + Math.random() * (now - past)).toISOString();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function seedAdmin() {
  console.log('\n[1/4] Ensuring admin user exists in public.users …');

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('id', ADMIN_ID)
    .single();

  if (existing) {
    // Just make sure role is admin
    const { error } = await supabase
      .from('users')
      .update({ role: 'admin' })
      .eq('id', ADMIN_ID);
    if (error) throw new Error(`Could not update admin role: ${error.message}`);
    console.log('  Admin row already present — role confirmed as admin.');
  } else {
    // Row missing: insert it (auth user already exists)
    const { error } = await supabase.from('users').insert({
      id: ADMIN_ID,
      first_name: 'Admin',
      last_name: 'Valencia Verde',
      national_id: '00000000',
      phone: '04140000000',
      email: 'admin@valenciaverdej23.com',
      role: 'admin',
      disabled: false,
    });
    if (error) throw new Error(`Could not insert admin row: ${error.message}`);
    console.log('  Admin row inserted.');
  }
}

async function seedUsers() {
  console.log('\n[2/4] Creating 10 regular users …');
  const createdIds = [];

  for (const u of REGULAR_USERS) {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: 'Test123!',
      email_confirm: true,
      user_metadata: {
        first_name: u.first_name,
        last_name: u.last_name,
        national_id: u.national_id,
        phone: u.phone,
      },
    });

    if (authError) {
      // Might already exist from a previous seed run — try to look it up
      if (authError.message.toLowerCase().includes('already') ||
          authError.message.toLowerCase().includes('exists')) {
        console.log(`  [skip auth] ${u.email} already exists in auth.`);
        // Try to find their id in public.users
        const { data: existing } = await supabase
          .from('users')
          .select('id')
          .eq('email', u.email)
          .single();
        if (existing) {
          createdIds.push(existing.id);
          console.log(`  [skip public] ${u.email} already in public.users.`);
          continue;
        }
        // Auth user exists but no public row — fetch the auth id via admin list
        const { data: listData } = await supabase.auth.admin.listUsers();
        const authUser = listData?.users?.find((au) => au.email === u.email);
        if (authUser) {
          const { error: insertError } = await supabase.from('users').insert({
            id: authUser.id,
            first_name: u.first_name,
            last_name: u.last_name,
            national_id: u.national_id,
            phone: u.phone,
            email: u.email,
            role: 'user',
            disabled: false,
          });
          if (insertError && !insertError.message.toLowerCase().includes('duplicate')) {
            console.warn(`  [warn] Could not insert public row for ${u.email}: ${insertError.message}`);
          } else {
            createdIds.push(authUser.id);
          }
        }
        continue;
      }
      console.warn(`  [warn] Auth creation failed for ${u.email}: ${authError.message}`);
      continue;
    }

    const userId = authData.user.id;

    // Upsert into public.users (trigger may have already inserted it)
    const { error: publicError } = await supabase.from('users').upsert({
      id: userId,
      first_name: u.first_name,
      last_name: u.last_name,
      national_id: u.national_id,
      phone: u.phone,
      email: u.email,
      role: 'user',
      disabled: false,
    });

    if (publicError) {
      console.warn(`  [warn] public.users upsert failed for ${u.email}: ${publicError.message}`);
    } else {
      createdIds.push(userId);
      console.log(`  Created: ${u.first_name} ${u.last_name} (${u.email})`);
    }
  }

  console.log(`  ${createdIds.length} user(s) ready.`);
  return createdIds;
}

async function seedReports(userIds) {
  console.log('\n[3/4] Creating 25 reports …');

  if (userIds.length === 0) {
    console.warn('  No user IDs available — skipping reports.');
    return;
  }

  const reports = [];

  for (let i = 0; i < 25; i++) {
    const neighborhood = randomElement(NEIGHBORHOODS);
    const type = randomElement(REPORT_TYPES);
    const priority = randomElement(PRIORITIES);
    const status = randomElement(STATUSES);
    const hasInjured = Math.random() < 0.25; // ~25 % chance

    // Scatter coordinates slightly around the neighbourhood centroid
    const lat = randomFloat(neighborhood.lat - 0.01, neighborhood.lat + 0.01);
    const lng = randomFloat(neighborhood.lng - 0.01, neighborhood.lng + 0.01);

    const description =
      `Sector ${neighborhood.name}: ` + randomElement(DESCRIPTIONS[type]);

    reports.push({
      user_id: randomElement(userIds),
      date: randomDateWithinDays(30),
      type,
      description,
      latitude: lat,
      longitude: lng,
      priority,
      image_url: `https://placehold.co/800x600/ff6b35/white?text=${encodeURIComponent('Incendio')}`,
      has_injured: hasInjured,
      injured_details: hasInjured ? randomElement(INJURED_DETAILS) : null,
      status,
    });
  }

  const { error } = await supabase.from('reports').insert(reports);
  if (error) throw new Error(`Reports insert failed: ${error.message}`);
  console.log(`  Inserted 25 reports.`);
}

async function seedContacts() {
  console.log('\n[4/4] Creating 6 emergency contacts …');

  const { error } = await supabase.from('contacts').insert(CONTACTS);
  if (error) throw new Error(`Contacts insert failed: ${error.message}`);
  console.log('  Inserted 6 contacts.');
}

(async () => {
  try {
    await seedAdmin();
    const userIds = await seedUsers();
    // Also include the admin id so some reports are attributed to admin
    await seedReports([...userIds, ADMIN_ID]);
    await seedContacts();
    console.log('\nSeed completed successfully.\n');
  } catch (err) {
    console.error('\nSeed failed:', err.message);
    process.exit(1);
  }
})();
