export interface DashboardSummaryResponse {    
    numberOfOrders          : number;
    paidOrders              : number;
    notPaidOrders           : number;
    numberOfClients         : number;
    numberOfProducts        : number
    productswithNoInventory : number;
    lowInventory            : number;
}