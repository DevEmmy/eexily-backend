

export interface GasDto {
    size: string;
    houseHoldSize: number;
    primaryCookingAppliance: string;
    ownedBy: string; 
}

export interface UpdateGasDto {
    size?: string;
    houseHoldSize?: number;
    primaryCookingAppliance?: string;
    ownedBy?: string;
}
