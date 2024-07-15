import React, { useState, useEffect } from "react";
import {
	fetchJurisdictions,
	fetchSubJurisdictions,
	Jurisdiction,
} from "../api";

interface JurisdictionState extends Jurisdiction {
	subJurisdictions?: JurisdictionState[];
	loadingSubJurisdictions?: boolean;
	errorLoadingSubJurisdictions?: boolean;
}

const JurisdictionSelector: React.FC = () => {
	const [jurisdictions, setJurisdictions] = useState<JurisdictionState[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		const loadJurisdictions = async () => {
			try {
				const data = await fetchJurisdictions();
				setJurisdictions(data);
			} catch (error) {
				setError(true);
			} finally {
				setLoading(false);
			}
		};
		loadJurisdictions();
	}, []);

	const handleJurisdictionCheck = async (jurisdiction: JurisdictionState) => {
		if (jurisdiction.subJurisdictions || jurisdiction.loadingSubJurisdictions)
			return;

		jurisdiction.loadingSubJurisdictions = true;
		setJurisdictions([...jurisdictions]);

		try {
			const subJurisdictions = await fetchSubJurisdictions(jurisdiction.id);
			jurisdiction.subJurisdictions = subJurisdictions.map(
				(subJurisdiction) => ({
					...subJurisdiction,
					subJurisdictions: undefined,
					loadingSubJurisdictions: false,
					errorLoadingSubJurisdictions: false,
				})
			);
		} catch (error) {
			jurisdiction.errorLoadingSubJurisdictions = true;
		} finally {
			jurisdiction.loadingSubJurisdictions = false;
			setJurisdictions([...jurisdictions]);
		}
	};

	const renderJurisdictions = (
		jurisdictions: JurisdictionState[],
		level = 0
	) => {
		return jurisdictions.map((jurisdiction) => (
			<div key={jurisdiction.id} style={{ marginLeft: level * 20 }}>
				<label>
					<input
						type="checkbox"
						onChange={() => handleJurisdictionCheck(jurisdiction)}
					/>
					{jurisdiction.name}
				</label>
				{jurisdiction.loadingSubJurisdictions && (
					<div>Loading sub-jurisdictions...</div>
				)}
				{jurisdiction.subJurisdictions &&
					renderJurisdictions(jurisdiction.subJurisdictions, level + 1)}
			</div>
		));
	};

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error loading jurisdictions</div>;

	return <div>{renderJurisdictions(jurisdictions)}</div>;
};

export default JurisdictionSelector;
