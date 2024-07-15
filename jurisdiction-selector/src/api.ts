export interface Jurisdiction {
	id: number;
	name: string;
	subJurisdictions?: Jurisdiction[];
}

const SPAIN_JSON: Jurisdiction = {
	id: 1,
	name: "Spain",
	subJurisdictions: [
		{
			id: 101,
			name: "Andalucía",
			subJurisdictions: [
				{ id: 10101, name: "Almería" },
				{ id: 10102, name: "Cádiz" },
				{ id: 10103, name: "Córdoba" },
				{ id: 10104, name: "Granada" },
				{ id: 10105, name: "Huelva" },
				{ id: 10106, name: "Jaén" },
				{ id: 10107, name: "Málaga" },
				{ id: 10108, name: "Sevilla" },
			],
		},
		{
			id: 102,
			name: "Aragón",
			subJurisdictions: [
				{ id: 10201, name: "Huesca" },
				{ id: 10202, name: "Teruel" },
				{ id: 10203, name: "Zaragoza" },
			],
		},
		{
			id: 103,
			name: "Asturias, Principado de",
			subJurisdictions: [{ id: 10301, name: "Asturias" }],
		},
		{
			id: 104,
			name: "Balears, Illes",
			subJurisdictions: [{ id: 10401, name: "Balears" }],
		},
		{
			id: 105,
			name: "Canarias",
			subJurisdictions: [
				{ id: 10501, name: "Las Palmas" },
				{ id: 10502, name: "Santa Cruz de Tenerife" },
			],
		},
		{
			id: 106,
			name: "Cantabria",
			subJurisdictions: [{ id: 10601, name: "Cantabria" }],
		},
		{
			id: 107,
			name: "Castilla y León",
			subJurisdictions: [
				{ id: 10701, name: "Ávila" },
				{ id: 10702, name: "Burgos" },
				{ id: 10703, name: "León" },
				{ id: 10704, name: "Palencia" },
				{ id: 10705, name: "Salamanca" },
				{ id: 10706, name: "Segovia" },
				{ id: 10707, name: "Soria" },
				{ id: 10708, name: "Valladolid" },
				{ id: 10709, name: "Zamora" },
			],
		},
		{
			id: 108,
			name: "Castilla-La Mancha",
			subJurisdictions: [
				{ id: 10801, name: "Albacete" },
				{ id: 10802, name: "Ciudad Real" },
				{ id: 10803, name: "Cuenca" },
				{ id: 10804, name: "Guadalajara" },
				{ id: 10805, name: "Toledo" },
			],
		},
		{
			id: 109,
			name: "Cataluña",
			subJurisdictions: [
				{ id: 10901, name: "Barcelona" },
				{ id: 10902, name: "Girona" },
				{ id: 10903, name: "Lleida" },
				{ id: 10904, name: "Tarragona" },
			],
		},
		{
			id: 110,
			name: "Comunitat Valenciana",
			subJurisdictions: [
				{ id: 11001, name: "Alicante" },
				{ id: 11002, name: "Castellón" },
				{ id: 11003, name: "Valencia" },
			],
		},
		{
			id: 111,
			name: "Extremadura",
			subJurisdictions: [
				{ id: 11101, name: "Badajoz" },
				{ id: 11102, name: "Cáceres" },
			],
		},
		{
			id: 112,
			name: "Galicia",
			subJurisdictions: [
				{ id: 11201, name: "A Coruña" },
				{ id: 11202, name: "Lugo" },
				{ id: 11203, name: "Ourense" },
				{ id: 11204, name: "Pontevedra" },
			],
		},
		{
			id: 113,
			name: "Madrid, Comunidad de",
			subJurisdictions: [{ id: 11301, name: "Madrid" }],
		},
		{
			id: 114,
			name: "Murcia, Región de",
			subJurisdictions: [{ id: 11401, name: "Murcia" }],
		},
		{
			id: 115,
			name: "Navarra, Comunidad Foral de",
			subJurisdictions: [{ id: 11501, name: "Navarra" }],
		},
		{
			id: 116,
			name: "País Vasco",
			subJurisdictions: [
				{ id: 11601, name: "Álava" },
				{ id: 11602, name: "Guipúzcoa" },
				{ id: 11603, name: "Vizcaya" },
			],
		},
		{
			id: 117,
			name: "Rioja, La",
			subJurisdictions: [{ id: 11701, name: "La Rioja" }],
		},
		{
			id: 118,
			name: "Ceuta",
			subJurisdictions: [{ id: 11801, name: "Ceuta" }],
		},
		{
			id: 119,
			name: "Melilla",
			subJurisdictions: [{ id: 11901, name: "Melilla" }],
		},
	],
};

const fakeJurisdictionsData = {
	jurisdictions: [
		SPAIN_JSON,
		{
			id: 2,
			name: "United Kingdom",
			subJurisdictions: [
				{ id: 201, name: "England & Wales" },
				{ id: 202, name: "Scotland" },
				{ id: 203, name: "Northern Ireland" },
			],
		},
	],
};

async function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchJurisdictions(): Promise<Jurisdiction[]> {
	await delay(500);
	const jurisdictions = fakeJurisdictionsData.jurisdictions.map((j) => ({
		id: j.id,
		name: j.name,
	}));
	return jurisdictions;
}

function findJurisdictionRecursive(
	jurisdictions: Jurisdiction[],
	jurisdictionId: number
): Jurisdiction | null {
	for (const jurisdiction of jurisdictions) {
		if (jurisdiction.id === jurisdictionId) {
			return jurisdiction;
		}

		if (jurisdiction.subJurisdictions) {
			const found = findJurisdictionRecursive(
				jurisdiction.subJurisdictions,
				jurisdictionId
			);
			if (found) {
				return found;
			}
		}
	}

	return null;
}

function findJurisdiction(jurisdictionId: number): Jurisdiction | null {
	return findJurisdictionRecursive(
		fakeJurisdictionsData.jurisdictions,
		jurisdictionId
	);
}

export async function fetchJurisdiction(
	jurisdictionId: number
): Promise<Jurisdiction> {
	await delay(1000);
	const jurisdiction = findJurisdiction(jurisdictionId);

	if (!jurisdiction) {
		throw new Error("Jurisdiction not found");
	}

	return { id: jurisdiction.id, name: jurisdiction.name };
}

export async function fetchSubJurisdictions(
	jurisdictionId: number
): Promise<Jurisdiction[]> {
	await delay(1500);
	const jurisdiction = findJurisdiction(jurisdictionId);

	if (!jurisdiction) {
		throw new Error("Jurisdiction not found");
	}

	return (jurisdiction.subJurisdictions || []).map((j) => ({
		id: j.id,
		name: j.name,
	}));
}
