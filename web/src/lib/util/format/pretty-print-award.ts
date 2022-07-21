import { AwardTypes2021 } from "../../graphql/generated/graphql-operations";
import { prettyPrintOrdinal } from "./pretty-print-ordinal";

export function prettyPrintAwardCategory(type: AwardTypes2021): string {
    console.log(type);
    switch (type) {
        case AwardTypes2021.Compass:
        case AwardTypes2021.Connect:
        case AwardTypes2021.Control:
        case AwardTypes2021.Design:
        case AwardTypes2021.Innovate:
        case AwardTypes2021.Inspire:
        case AwardTypes2021.JudgesChoice:
        case AwardTypes2021.Motivate:
        case AwardTypes2021.Promote:
        case AwardTypes2021.Think:
            return prettyPrintAwardName(type) + " Winners";
        case AwardTypes2021.DeansListFinalist:
        case AwardTypes2021.DeansListSemiFinalist:
        case AwardTypes2021.DeansListWinner:
            return prettyPrintAwardName(type) + "s";
        case AwardTypes2021.Winner:
        case AwardTypes2021.Finalist:
        case AwardTypes2021.DivisionFinalist:
        case AwardTypes2021.DivisionWinner:
        case AwardTypes2021.TopRanked:
            return prettyPrintAwardName(type);
        default:
            console.error(`Unknown award ${type}`);
            return "Unknown Award";
    }
}

export function prettyPrintAwardName(type: AwardTypes2021): string {
    switch (type) {
        case AwardTypes2021.Compass:
            return "Compass Award";
        case AwardTypes2021.Connect:
            return "Connect Award";
        case AwardTypes2021.Control:
            return "Control Award";
        case AwardTypes2021.DeansListFinalist:
            return "Dean's List Finalist";
        case AwardTypes2021.DeansListSemiFinalist:
            return "Dean's List Semifinalist";
        case AwardTypes2021.DeansListWinner:
            return "Dean's List Winner";
        case AwardTypes2021.Design:
            return "Design Award";
        case AwardTypes2021.DivisionFinalist:
            return "Division Finalist Alliance";
        case AwardTypes2021.DivisionWinner:
            return "Division Winning Alliance";
        case AwardTypes2021.Winner:
            return "Winning Alliance";
        case AwardTypes2021.Finalist:
            return "Finalist Alliance";
        case AwardTypes2021.Innovate:
            return "Innovate Award";
        case AwardTypes2021.Inspire:
            return "Inspire Award";
        case AwardTypes2021.JudgesChoice:
            return "Judges' Choice Award";
        case AwardTypes2021.Motivate:
            return "Motivate Award";
        case AwardTypes2021.Promote:
            return "Promote Award";
        case AwardTypes2021.Think:
            return "Think Award";
        case AwardTypes2021.TopRanked:
            return "Top Ranked";
        default:
            console.error(`Unknown award ${type}`);
            return "Unknown Award1";
    }
}

export function prettyPrintAwardPlacement(type: AwardTypes2021, placement: number): string {
    switch (type) {
        case AwardTypes2021.DeansListFinalist:
        case AwardTypes2021.DeansListSemiFinalist:
        case AwardTypes2021.DeansListWinner:
            return prettyPrintAwardName(type);
        case AwardTypes2021.DivisionFinalist:
        case AwardTypes2021.DivisionWinner:
        case AwardTypes2021.Winner:
        case AwardTypes2021.Finalist:
            return `${prettyPrintAwardName(type)} ${alliancePlacement(placement)}`;
        case AwardTypes2021.TopRanked:
            return `Top Ranked ${prettyPrintOrdinal(placement)}`;
        default:
            return `${prettyPrintAwardName(type)} ${winnerOrOrdinal(placement)}`;
    }
}

export function prettyPrintAwardPlacementParts(
    type: AwardTypes2021,
    placement: number,
    name: string | null
): [string, string] {
    switch (type) {
        case AwardTypes2021.DeansListFinalist:
        case AwardTypes2021.DeansListSemiFinalist:
        case AwardTypes2021.DeansListWinner:
            return [prettyPrintAwardName(type), `(${name})`];
        case AwardTypes2021.DivisionFinalist:
        case AwardTypes2021.DivisionWinner:
        case AwardTypes2021.Winner:
        case AwardTypes2021.Finalist:
            return [prettyPrintAwardName(type), alliancePlacement(placement)];
        case AwardTypes2021.TopRanked:
            return ["Top Ranked", prettyPrintOrdinal(placement) + " Place"];
        default:
            return [prettyPrintAwardName(type), winnerOrOrdinal(placement)];
    }
}

export function awardHasName(type: AwardTypes2021): boolean {
    return (
        type == AwardTypes2021.DeansListFinalist ||
        type == AwardTypes2021.DeansListSemiFinalist ||
        type == AwardTypes2021.DeansListWinner
    );
}

function winnerOrOrdinal(placement: number): string {
    return placement == 1 ? "Winner" : `${prettyPrintOrdinal(placement)} Place`;
}

function alliancePlacement(placement: number): string {
    return placement == 1 ? "Captain" : `${prettyPrintOrdinal(placement - 1)} Pick`;
}
