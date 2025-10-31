import "dotenv/config";
import { MikroORM } from "@mikro-orm/core";
import config from "../mikro-orm.config.js";
import { User } from "../entities/User.js";
import { Bird } from "../entities/Bird.js";
import { BirdVisualTrait } from "../entities/BirdVisualTrait.js";
import { BirdSighting } from "../entities/BirdSighting.js";
import { Comment } from "../entities/Comment.js";

async function run() {
  const orm = await MikroORM.init(config);

  try {
    const em = orm.em.fork();

    console.log("cleaning collections...");
    await em.nativeDelete(Comment, {});
    await em.nativeDelete(BirdSighting, {});
    await em.nativeDelete(Bird, {});
    await em.nativeDelete(BirdVisualTrait, {});
    await em.nativeDelete(User, {});

    console.log("creating example users...");
    const user1 = em.create(User, {
      username: "juan.perez",
      googleId: "google-123456",
      name: "Juan Pérez",
      avatarURL: "https://i.pravatar.cc/150?img=12",
      role: "user",
    } as any);

    const user2 = em.create(User, {
      username: "maria.gomez",
      googleId: "google-789012",
      name: "María Gómez",
      avatarURL: "https://i.pravatar.cc/150?img=45",
      role: "user",
    } as any);

    const user3 = em.create(User, {
      username: "lucas.rodriguez",
      googleId: "google-555666",
      name: "Lucas Rodríguez",
      avatarURL: "https://i.pravatar.cc/150?img=33",
      role: "user",
    } as any);

    const admin = em.create(User, {
      username: "admin",
      googleId: "google-admin",
      name: "Administrador",
      avatarURL: "https://i.pravatar.cc/150?img=5",
      role: "admin",
    } as any);

    await em.flush();

    console.log("seeding bird visual traits (nuevos tipos en español)...");

    // Forma de pico
    const picoRecto = em.create(BirdVisualTrait, { type: "Forma de pico", description: "Recto" } as any);
    const picoCurvado = em.create(BirdVisualTrait, { type: "Forma de pico", description: "Curveado" } as any);
    const picoGancho = em.create(BirdVisualTrait, { type: "Forma de pico", description: "En gancho" } as any);

    // Patrón de plumas
    const plumajeTricolor = em.create(BirdVisualTrait, { type: "Patrón de plumas", description: "Tricolor" } as any);
    const plumajeBicolor = em.create(BirdVisualTrait, { type: "Patrón de plumas", description: "Bicolor" } as any);
    const plumajeSolido = em.create(BirdVisualTrait, { type: "Patrón de plumas", description: "Sólido" } as any);
    const plumajeIridescente = em.create(BirdVisualTrait, { type: "Patrón de plumas", description: "Iridescente" } as any); // fix

    // Color de patas
    const patasAmarillas = em.create(BirdVisualTrait, { type: "Color de patas", description: "Amarillo" } as any);
    const patasNegras = em.create(BirdVisualTrait, { type: "Color de patas", description: "Negro" } as any);
    const patasRosadas = em.create(BirdVisualTrait, { type: "Color de patas", description: "Rosado" } as any);

    // Tamaño Ave
    const tamanoPequeno = em.create(BirdVisualTrait, { type: "Tamaño Ave", description: "Pequeño" } as any);
    const tamanoMediano = em.create(BirdVisualTrait, { type: "Tamaño Ave", description: "Mediano" } as any);
    const tamanoGrande = em.create(BirdVisualTrait, { type: "Tamaño Ave", description: "Grande" } as any);

    await em.flush();

    console.log("creating birds...");

    // Cotorra Argentina
    const cotorra = em.create(Bird, {
      name: "Cotorra Argentina",
      scientificName: "Myiopsitta monachus",
      description: "Loro de tamaño mediano, verde con abdomen grisáceo; común en áreas urbanas y rurales.",
      imageURL: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSoXuoAYmrnC8mJnMWZQ6mPhPPLLEdNR6woCzpkBOK_DNs2pUAHzyYsDQIV3zKUTACkP4BplHpCdijbqZyEEMumLeO72UaC-XEcKZvz2HY",
      visualTraits: [
        { birdVisualTraitId: picoGancho.id },
        { birdVisualTraitId: plumajeBicolor.id },
        { birdVisualTraitId: patasNegras.id }, // grisáceas en vida real; se aproxima
        { birdVisualTraitId: tamanoMediano.id },
      ],
    } as any);

    // Fiofío común (corrige género)
    const fiofio = em.create(Bird, {
      name: "Fiofío Común",
      scientificName: "Elaenia parvirostris",
      description: "Tiránido pequeño, oliva/grisáceo; pico recto y fino; muy frecuente en arboledas.",
      imageURL: "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/81493801/900",
      visualTraits: [
        { birdVisualTraitId: picoRecto.id },
        { birdVisualTraitId: plumajeSolido.id },
        { birdVisualTraitId: patasNegras.id },
        { birdVisualTraitId: tamanoPequeno.id },
      ],
    } as any);

    // Paloma (Columba livia)
    const paloma = em.create(Bird, {
      name: "Paloma",
      scientificName: "Columba livia",
      description: "Paloma urbana común; gris con barras alares y cuello iridiscente.",
      imageURL: "https://inaturalist-open-data.s3.amazonaws.com/photos/96934693/original.jpg",
      visualTraits: [
        { birdVisualTraitId: picoRecto.id },
        { birdVisualTraitId: plumajeTricolor.id }, // gris + barras + iridiscencias
        { birdVisualTraitId: patasRosadas.id },
        { birdVisualTraitId: tamanoMediano.id },
      ],
    } as any);

    // Tordo renegrido (Molothrus bonariensis)  ← corrige especie local
    const tordo = em.create(Bird, {
      name: "Tordo Renegrido",
      scientificName: "Molothrus bonariensis",
      description: "Ictérido común; macho negro con brillo iridiscente, hembra parda.",
      imageURL: "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/245438551/900",
      visualTraits: [
        { birdVisualTraitId: picoRecto.id },
        { birdVisualTraitId: plumajeIridescente.id }, // por el macho
        { birdVisualTraitId: patasNegras.id },
        { birdVisualTraitId: tamanoMediano.id },
      ],
    } as any);

    // Gorrión
    const gorron = em.create(Bird, {
      name: "Gorrión",
      scientificName: "Passer domesticus",
      description: "Pequeña ave granívora, muy asociada a asentamientos humanos; patrón bicolor en muchos individuos.",
      imageURL: "https://upload.wikimedia.org/wikipedia/commons/d/df/Huismus%2C_man.jpg",
      visualTraits: [
        { birdVisualTraitId: picoRecto.id },
        { birdVisualTraitId: plumajeBicolor.id },
        { birdVisualTraitId: patasRosadas.id },
        { birdVisualTraitId: tamanoPequeno.id },
      ],
    } as any);

    // Pirincha (Guira guira)  ← corrige pico/patas
    const pirincha = em.create(Bird, {
      name: "Pirincha",
      scientificName: "Guira guira",
      description: "Cucúlido gregario con cresta; plumaje contrastado y cola larga.",
      imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Guira_guira.jpg/250px-Guira_guira.jpg",
      visualTraits: [
        { birdVisualTraitId: picoCurvado.id },
        { birdVisualTraitId: plumajeTricolor.id },
        { birdVisualTraitId: patasAmarillas.id },
        { birdVisualTraitId: tamanoMediano.id },
      ],
    } as any);

    // Carancho (Caracara plancus)
    const carancho = em.create(Bird, {
      name: "Carancho",
      scientificName: "Caracara plancus",
      description: "Ave rapaz carroñera de tamaño grande con pico en gancho; frecuente en pastizales y bordes urbanos.",
      imageURL: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTrD39IUwDmwVL2F-CvJ9xgrFS0BiXPKW_jC91F9C8NIAZNX0vF8yNjmJ4n-jVx-cekMlYHuLhjcRszctTWkQ8LX_8mzk-9cv_Mh0Vdbw",
      visualTraits: [
        { birdVisualTraitId: picoGancho.id },
        { birdVisualTraitId: plumajeTricolor.id },
        { birdVisualTraitId: patasAmarillas.id },
        { birdVisualTraitId: tamanoGrande.id },
      ],
    } as any);

    // Hornero
    const hornero = em.create(Bird, {
      name: "Hornero",
      scientificName: "Furnarius rufus",
      description: "Ave nacional de Argentina, construye nidos de barro con forma de horno.",
      imageURL: "https://upload.wikimedia.org/wikipedia/commons/2/2f/HORNERO_Furnarius_rufus.jpg",
      visualTraits: [
        { birdVisualTraitId: picoRecto.id },
        { birdVisualTraitId: plumajeSolido.id },
        { birdVisualTraitId: patasRosadas.id }, // corrige
        { birdVisualTraitId: tamanoMediano.id },
      ],
    } as any);

    // Picaflor / Colibrí
    const picaflor = em.create(Bird, {
      name: "Picaflor Común",
      scientificName: "Chlorostilbon lucidus",
      description: "Colibrí pequeño de color verde brillante, con pico fino y recto adaptado a néctar.",
      imageURL: "https://www.ecoregistros.org/site/images/dataimages/2018/03/13/253853/PICAFLOR-COMUN-PDE-_MG_1954.jpg",
      visualTraits: [
        { birdVisualTraitId: picoRecto.id },
        { birdVisualTraitId: plumajeIridescente.id },
        { birdVisualTraitId: patasNegras.id },
        { birdVisualTraitId: tamanoPequeno.id },
      ],
    } as any);

    // Benteveo (extra para que el total sea 11)
    const benteveo = em.create(Bird, {
      name: "Benteveo",
      scientificName: "Pitangus sulphuratus",
      description: "Ave conspicua con ceja blanca y vientre amarillo intenso; frecuente en áreas abiertas urbanas.",
      imageURL: "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/302089971/900",
      visualTraits: [
        { birdVisualTraitId: picoRecto.id },
        { birdVisualTraitId: plumajeTricolor.id },
        { birdVisualTraitId: patasNegras.id },
        { birdVisualTraitId: tamanoMediano.id },
      ],
    } as any);

    // Chingolo (extra)
    const chiringolo = em.create(Bird, {
      name: "Chiringolo",
      scientificName: "Zonotrichia capensis",
      description: "Gorrión americano muy común; cabeza listada, canto característico.",
      imageURL: "https://cdn.download.ams.birds.cornell.edu/api/v2/asset/321114171/900",
      visualTraits: [
        { birdVisualTraitId: picoRecto.id },
        { birdVisualTraitId: plumajeTricolor.id },
        { birdVisualTraitId: patasRosadas.id },
        { birdVisualTraitId: tamanoPequeno.id },
      ],
    } as any);

    await em.flush();

    console.log("creating sightings...");
    const sightings = [
      em.create(BirdSighting, { dateTime: new Date("2025-10-15T08:30:00"), ubicationLatitude: -34.6037, ubicationLongitude: -58.3816, BirdID: cotorra.id, UserID: user1.id } as any),
      em.create(BirdSighting, { dateTime: new Date("2025-10-16T14:20:00"), ubicationLatitude: -34.6158, ubicationLongitude: -58.4333, BirdID: fiofio.id, UserID: user1.id } as any),
      em.create(BirdSighting, { dateTime: new Date("2025-10-18T09:15:00"), ubicationLatitude: -34.5875, ubicationLongitude: -58.3974, BirdID: picaflor.id, UserID: user2.id } as any),
      em.create(BirdSighting, { dateTime: new Date("2025-10-20T16:45:00"), ubicationLatitude: -34.6083, ubicationLongitude: -58.3712, BirdID: paloma.id, UserID: user2.id } as any),
      em.create(BirdSighting, { dateTime: new Date("2025-10-22T07:00:00"), ubicationLatitude: -34.5950, ubicationLongitude: -58.4200, BirdID: carancho.id, UserID: user3.id } as any),
      em.create(BirdSighting, { dateTime: new Date("2025-10-23T10:30:00"), ubicationLatitude: -34.6000, ubicationLongitude: -58.4200, BirdID: gorron.id, UserID: user1.id } as any),
      em.create(BirdSighting, { dateTime: new Date("2025-10-24T12:00:00"), ubicationLatitude: -34.6100, ubicationLongitude: -58.4300, BirdID: tordo.id, UserID: user2.id } as any),
      // extras para las nuevas aves
      em.create(BirdSighting, { dateTime: new Date("2025-10-24T17:40:00"), ubicationLatitude: -32.9442, ubicationLongitude: -60.6505, BirdID: benteveo.id, UserID: user3.id } as any),
      em.create(BirdSighting, { dateTime: new Date("2025-10-25T07:55:00"), ubicationLatitude: -32.9500, ubicationLongitude: -60.6500, BirdID: chiringolo.id, UserID: user1.id } as any),
    ];
    for (const s of sightings) {
      em.persist(s);
    }

    await em.flush();

    console.log("creating comments...");
    const comments = [
      em.create(Comment, { userId: user1.id, birdId: cotorra.id, text: "Vi una bandada de cotorras en los eucaliptos, mucha actividad por la tarde.", createdAt: new Date("2025-10-15T10:00:00") } as any),
      em.create(Comment, { userId: user2.id, birdId: picaflor.id, text: "Vienen seguido al bebedero, colorido espectacular por la mañana.", createdAt: new Date("2025-10-18T10:00:00") } as any),
      em.create(Comment, { userId: user3.id, birdId: carancho.id, text: "Vi un carancho alimentándose cerca de la ruta, impresionante vuelo.", createdAt: new Date("2025-10-22T08:00:00") } as any),
      em.create(Comment, { userId: user1.id, birdId: paloma.id, text: "Palomas por montón en la plaza principal, comportamiento muy sociable con la gente.", createdAt: new Date("2025-10-20T17:00:00") } as any),
      em.create(Comment, { userId: user2.id, birdId: gorron.id, text: "Los gorriones están anidando en los aleros de mi casa.", createdAt: new Date("2025-10-21T12:00:00") } as any),
      em.create(Comment, { userId: user3.id, birdId: tordo.id, text: "Tordos formando grupos ruidosos al amanecer.", createdAt: new Date("2025-10-24T13:00:00") } as any),
      // comentarios para las nuevas aves
      em.create(Comment, { userId: admin.id, birdId: benteveo.id, text: "Muy activo en cables y postes; el contraste amarillo-blanco lo delata.", createdAt: new Date("2025-10-24T18:00:00") } as any),
      em.create(Comment, { userId: user1.id, birdId: chiringolo.id, text: "Canto bien marcado desde arbustos bajos, se dejó ver cerca.", createdAt: new Date("2025-10-25T08:30:00") } as any),
    ];
    for (const c of comments) {
      em.persist(c);
    }

    await em.flush();

    console.log("\n✅ Seed completado exitosamente!");
    console.log(`   - ${4} usuarios creados`);
    console.log(`   - ${12} rasgos visuales creados`);
    console.log(`   - ${11} aves creadas`);
    console.log(`   - ${sightings.length} avistamientos creados`);
    console.log(`   - ${comments.length} comentarios creados`);
  } catch (err) {
    console.error("❌ Error al ejecutar seed:", err);
    throw err;
  } finally {
    await orm.close(true);
  }
}

run();
