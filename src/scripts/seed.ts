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
    // Para MongoDB, usar removeAll() con el repositorio
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

    await em.flush();

    console.log("seeding birdvisualtraits...");
    // BeakShape
    const beakShort = em.create(BirdVisualTrait, {
      type: "BeakShape",
      description: "Short",
    } as any);
    const beakCurved = em.create(BirdVisualTrait, {
      type: "BeakShape",
      description: "Curved",
    } as any);
    const beakHooked = em.create(BirdVisualTrait, {
      type: "BeakShape",
      description: "Hooked",
    } as any);

    // PlumagePattern
    const plumageSpotted = em.create(BirdVisualTrait, {
      type: "PlumagePattern",
      description: "Spotted",
    } as any);
    const plumageSolid = em.create(BirdVisualTrait, {
      type: "PlumagePattern",
      description: "Solid color",
    } as any);
    const plumageIridescent = em.create(BirdVisualTrait, {
      type: "PlumagePattern",
      description: "Iridescent",
    } as any);

    // LegColor
    const legYellow = em.create(BirdVisualTrait, {
      type: "LegColor",
      description: "Yellow",
    } as any);
    const legBlack = em.create(BirdVisualTrait, {
      type: "LegColor",
      description: "Black",
    } as any);
    const legPink = em.create(BirdVisualTrait, {
      type: "LegColor",
      description: "Pink",
    } as any);

    // Size
    const sizeSmall = em.create(BirdVisualTrait, {
      type: "Size",
      description: "Small",
    } as any);
    const sizeMedium = em.create(BirdVisualTrait, {
      type: "Size",
      description: "Medium",
    } as any);
    const sizeLarge = em.create(BirdVisualTrait, {
      type: "Size",
      description: "Large",
    } as any);

    // TailShape
    const tailForked = em.create(BirdVisualTrait, {
      type: "TailShape",
      description: "Forked",
    } as any);
    const tailRounded = em.create(BirdVisualTrait, {
      type: "TailShape",
      description: "Rounded",
    } as any);

    await em.flush();

    console.log("creating birds...");
    const hornero = em.create(Bird, {
      name: "Hornero",
      scientificName: "Furnarius rufus",
      description: "Ave nacional de Argentina, conocida por construir nidos de barro en forma de horno.",
      imageURL: "https://upload.wikimedia.org/wikipedia/commons/2/2f/HORNERO_Furnarius_rufus.jpg",
      visualTraits: [
        { birdVisualTraitId: beakShort.id },
        { birdVisualTraitId: plumageSolid.id },
        { birdVisualTraitId: legBlack.id },
        { birdVisualTraitId: sizeMedium.id },
      ],
    } as any);

    const benteveo = em.create(Bird, {
      name: "Benteveo",
      scientificName: "Pitangus sulphuratus",
      description: "Ave muy común en zonas urbanas, conocida por su canto que suena como 'bien-te-veo'.",
      imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Benteveo.jpg/2560px-Benteveo.jpg",
      visualTraits: [
        { birdVisualTraitId: beakHooked.id },
        { birdVisualTraitId: plumageSolid.id},
        { birdVisualTraitId: legBlack.id },
        { birdVisualTraitId: sizeMedium.id },
      ],
    } as any);

    const calandria = em.create(Bird, {
      name: "Calandria Grande",
      scientificName: "Mimus saturninus",
      description: "Ave cantora conocida por su capacidad de imitar sonidos de otras aves y ambientes.",
      imageURL: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Mimus_saturninus_-Piraju%2C_Brasil-8.jpg",
      visualTraits: [
        { birdVisualTraitId: beakCurved.id },
        { birdVisualTraitId: plumageSpotted.id },
        { birdVisualTraitId: legYellow.id },
        { birdVisualTraitId: sizeMedium.id },
        { birdVisualTraitId: tailRounded.id },
      ],
    } as any);

    const picaflor = em.create(Bird, {
      name: "Picaflor Común",
      scientificName: "Chlorostilbon lucidus",
      description: "Colibrí pequeño de color verde brillante, muy común en jardines con flores.",
      imageURL: "https://upload.wikimedia.org/wikipedia/commons/4/45/Chlorostilbon_lucidus_lucidus%2C_Calle_Avaroa%2C_Santa_Cruz%2C_Bolivia_2.jpg",
      visualTraits: [
        { birdVisualTraitId: beakShort.id },
        { birdVisualTraitId: plumageIridescent.id },
        { birdVisualTraitId: sizeSmall.id },
        { birdVisualTraitId: tailForked.id },
      ],
    } as any);

    const tero = em.create(Bird, {
      name: "Tero",
      scientificName: "Vanellus chilensis",
      description: "Ave de campo muy ruidosa, conocida por defender agresivamente su territorio.",
      imageURL: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Vanellus_chilensis_-Temaik%C3%A9n_Zoo-8b.jpg/250px-Vanellus_chilensis_-Temaik%C3%A9n_Zoo-8b.jpg",
      visualTraits: [
        { birdVisualTraitId: beakShort.id },
        { birdVisualTraitId: plumageSolid.id },
        { birdVisualTraitId: legPink.id },
        { birdVisualTraitId: sizeMedium.id },
      ],
    } as any);

    await em.flush();

    console.log("creating sightings...");
    const sighting1 = em.create(BirdSighting, {
      dateTime: new Date("2025-10-15T08:30:00"),
      ubicationLatitude: -34.6037,
      ubicationLongitude: -58.3816,
      BirdID: hornero.id,
      UserID: user1.id,
    } as any);

    const sighting2 = em.create(BirdSighting, {
      dateTime: new Date("2025-10-16T14:20:00"),
      ubicationLatitude: -34.6158,
      ubicationLongitude: -58.4333,
      BirdID: benteveo.id,
      UserID: user1.id,
    } as any);

    const sighting3 = em.create(BirdSighting, {
      dateTime: new Date("2025-10-18T09:15:00"),
      ubicationLatitude: -34.5875,
      ubicationLongitude: -58.3974,
      BirdID: picaflor.id,
      UserID: user2.id,
    } as any);

    const sighting4 = em.create(BirdSighting, {
      dateTime: new Date("2025-10-20T16:45:00"),
      ubicationLatitude: -34.6083,
      ubicationLongitude: -58.3712,
      BirdID: calandria.id,
      UserID: user2.id,
    } as any);

    const sighting5 = em.create(BirdSighting, {
      dateTime: new Date("2025-10-22T07:00:00"),
      ubicationLatitude: -34.5950,
      ubicationLongitude: -58.4200,
      BirdID: tero.id,
      UserID: user1.id,
    } as any);

    await em.flush();

    console.log("💬 Creando comentarios...");
    const comment1 = em.create(Comment, {
      userId: user1.id,
      birdId: hornero.id,
      text: "¡Vi uno construyendo su nido en el parque! Increíble verlos trabajar con barro.",
      createdAt: new Date("2025-10-15T10:00:00"),
    } as any);

    const comment2 = em.create(Comment, {
      userId: user2.id,
      birdId: benteveo.id,
      text: "Esta ave es muy común en mi barrio. Su canto es inconfundible, especialmente temprano en la mañana.",
      createdAt: new Date("2025-10-16T15:30:00"),
    } as any);

    const comment3 = em.create(Comment, {
      userId: user1.id,
      birdId: picaflor.id,
      text: "Qué hermosos son los colibríes. Tengo un bebedero en mi jardín y vienen varios todos los días.",
      createdAt: new Date("2025-10-18T10:00:00"),
    } as any);

    const comment4 = em.create(Comment, {
      userId: user1.id,
      birdId: calandria.id,
      text: "Ave emblemática de Argentina. Su canto puede durar varios minutos sin parar.",
      createdAt: new Date("2025-10-20T17:00:00"),
    } as any);

    const comment5 = em.create(Comment, {
      userId: user2.id,
      birdId: tero.id,
      text: "Cuidado al acercarte cuando tienen pichones, son muy territoriales y pueden atacar.",
      createdAt: new Date("2025-10-22T08:00:00"),
    } as any);

    const comment6 = em.create(Comment, {
      userId: user2.id,
      birdId: hornero.id,
      text: "El hornero es el ave nacional argentina desde 1928. Sus nidos pueden durar varios años.",
      createdAt: new Date("2025-10-21T12:00:00"),
    } as any);

    await em.flush();

    console.log("\n✅ Seed completado exitosamente!");
    console.log(`   - ${3} usuarios creados`);
    console.log(`   - ${15} rasgos visuales creados`);
    console.log(`   - ${5} aves creadas`);
    console.log(`   - ${5} avistamientos creados`);
    console.log(`   - ${6} comentarios creados`);
  } catch (err) {
    console.error("❌ Error al ejecutar seed:", err);
    throw err;
  } finally {
    await orm.close(true);
  }
}

run();
