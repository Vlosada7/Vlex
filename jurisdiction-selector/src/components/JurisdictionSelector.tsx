import React, { useState, useEffect } from "react";
import {
	fetchJurisdictions,
	fetchSubJurisdictions,
	Jurisdiction,
} from "../api";
import LoadingSpinner from "./LoadingSpinner";

interface JurisdictionState extends Jurisdiction {
	subJurisdictions?: JurisdictionState[];
	loadingSubJurisdictions?: boolean;
	errorLoadingSubJurisdictions?: boolean;
	isExpanded?: boolean;
	isChecked?: boolean;
}

const JurisdictionSelector: React.FC = () => {
  const [jurisdictions, setJurisdictions] = useState<JurisdictionState[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
  const [selectedJurisdictionId, setSelectedJurisdictionId] = useState<
		number | null
	>(null);

  useEffect(() => {
		const loadJurisdictions = async () => {
			try {
				const data = await fetchJurisdictions();
				setJurisdictions(
					data.map((j) => ({ ...j, isExpanded: false, isChecked: false }))
				);
			} catch (error) {
				setError("Error loading jurisdictions");
			} finally {
				setLoading(false);
			}
		};
		loadJurisdictions();
	}, []);

  const handleJurisdictionClick = async (
		jurisdiction: JurisdictionState,
		level: number
	) => {
		const updatedJurisdictions = jurisdictions.map((j) =>
			collapseOthers(j, jurisdiction.id, level)
		);
		setJurisdictions(updatedJurisdictions);

		if (jurisdiction.isExpanded) {
			jurisdiction.isExpanded = false;
		} else {
			jurisdiction.isExpanded = true;
			if (!jurisdiction.subJurisdictions) {
				jurisdiction.loadingSubJurisdictions = true;
				setJurisdictions([...jurisdictions]);
				try {
					const subJurisdictions = await fetchSubJurisdictions(jurisdiction.id);
					jurisdiction.subJurisdictions = subJurisdictions.map(
						(subJurisdiction) => ({
							...subJurisdiction,
							isExpanded: false,
							isChecked: false,
						})
					);
				} catch (error) {
					jurisdiction.errorLoadingSubJurisdictions = true;
					setError("Error loading sub-jurisdictions");
				} finally {
					jurisdiction.loadingSubJurisdictions = false;
					setJurisdictions([...jurisdictions]);
				}
			}
		}

		if (
			!jurisdiction.subJurisdictions ||
			jurisdiction.subJurisdictions.length === 0
		) {
			if (selectedJurisdictionId === jurisdiction.id) {
				setSelectedJurisdictionId(null);
			} else {
				setSelectedJurisdictionId(jurisdiction.id);
			}
		} else {
			setSelectedJurisdictionId(null);
		}

		setJurisdictions([...jurisdictions]);
	};

  const handleCheckboxChange = async (
		jurisdiction: JurisdictionState,
		level: number
	) => {
		jurisdiction.isChecked = !jurisdiction.isChecked;
		if (jurisdiction.isChecked) {
			if (!jurisdiction.isExpanded) {
				handleJurisdictionClick(jurisdiction, level);
			}
		} else {
			collapseAll(jurisdiction);
		}
		setJurisdictions([...jurisdictions]);
	};

	const collapseAll = (jurisdiction: JurisdictionState) => {
		jurisdiction.isExpanded = false;
		jurisdiction.isChecked = false;
		if (jurisdiction.subJurisdictions) {
			jurisdiction.subJurisdictions.forEach((subJ) => collapseAll(subJ));
		}
	};

	const collapseOthers = (
		jurisdiction: JurisdictionState,
		targetId: number,
		targetLevel: number,
		currentLevel = 0
	): JurisdictionState => {
		if (currentLevel === targetLevel && jurisdiction.id !== targetId) {
			jurisdiction.isExpanded = false;
			collapseAll(jurisdiction); // Colapsa e desmarca todas as sub-jurisdições
		}
		if (jurisdiction.subJurisdictions) {
			jurisdiction.subJurisdictions = jurisdiction.subJurisdictions.map(
				(subJ) => collapseOthers(subJ, targetId, targetLevel, currentLevel + 1)
			);
		}
		return jurisdiction;
	};

  const getFullPath = (
		jurisdictions: JurisdictionState[],
		targetId: number,
		path: string[] = []
	): string | null => {
		for (const jurisdiction of jurisdictions) {
			if (jurisdiction.id === targetId) {
				return [...path, jurisdiction.name].join(" > ");
			}
			if (jurisdiction.subJurisdictions) {
				const result = getFullPath(jurisdiction.subJurisdictions, targetId, [
					...path,
					jurisdiction.name,
				]);
				if (result) {
					return result;
				}
			}
		}
		return null;
	};

  const handleClearSelection = () => {
		setSelectedJurisdictionId(null);
		const updatedJurisdictions = jurisdictions.map((j) => {
			collapseAll(j);
			return j;
		});
		setJurisdictions(updatedJurisdictions);
	};

  const renderJurisdictions = (
		jurisdictions: JurisdictionState[],
		level = 0
	) => {
		return jurisdictions.map((jurisdiction) => (
			<div
				key={jurisdiction.id}
				className={`p-4 mb-4 rounded-lg transition-all duration-300 ${
					level === 0 ? "bg-blue-100 shadow-lg w-1/2" : "bg-blue-50 ml-6"
				}`}
			>
				<div className="cursor-pointer flex items-center justify-between">
					<div className="flex items-center">
						<input
							type="checkbox"
							checked={jurisdiction.isChecked || false}
							onChange={() => handleCheckboxChange(jurisdiction, level)}
							className="mr-2"
						/>
						<span
							className={`mr-2 transform transition-transform ${
								jurisdiction.isExpanded ? "rotate-40" : ""
							}`}
							onClick={() => handleJurisdictionClick(jurisdiction, level)}
						>
							{jurisdiction.isExpanded ? "▼" : "▶"}
						</span>
						{jurisdiction.name}
					</div>
					{selectedJurisdictionId === jurisdiction.id && (
						<span className="text-green-500 ml-2">✔</span>
					)}
				</div>
				{jurisdiction.loadingSubJurisdictions && (
					<div className="ml-6">
						<LoadingSpinner />
					</div>
				)}
				{jurisdiction.errorLoadingSubJurisdictions && (
					<div className="ml-6 text-red-500">
						Error loading sub-jurisdictions
					</div>
				)}
				{jurisdiction.isExpanded && jurisdiction.subJurisdictions && (
					<div className="ml-6">
						{renderJurisdictions(jurisdiction.subJurisdictions, level + 1)}
					</div>
				)}
			</div>
		));
	};

  if (loading)
		return (
			<div className="flex items-center justify-center min-h-screen">
				<LoadingSpinner />
			</div>
		);
	if (error) return <div className="text-red-500">{error}</div>;

  const selectedJurisdiction = selectedJurisdictionId
		? getFullPath(jurisdictions, selectedJurisdictionId)
		: null;

  return (
		<div className="flex items-center justify-center min-h-screen relative">
			<div className="w-full max-w-screen-lg flex flex-col items-center">
				{renderJurisdictions(jurisdictions)}
			</div>
			{selectedJurisdiction && (
				<div className="fixed right-0 top-1/2 transform -translate-y-1/2 mt-8 mr-8 w-1/4 h-40 p-4 rounded-lg bg-blue-100 shadow-lg flex flex-col justify-between">
					<div>
						<h2 className="text-lg font-bold">Selected Jurisdiction</h2>
						<p>{selectedJurisdiction}</p>
					</div>
					<button
						className="self-end mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 transition-colors duration-300"
						onClick={handleClearSelection}
					>
						Clear Selection
					</button>
				</div>
			)}
		</div>
	);
};

export default JurisdictionSelector;
