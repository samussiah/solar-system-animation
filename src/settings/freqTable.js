export default function freqTable() {
    return {
        freqTable: {
            display: true,
            bars: true,
            structure: 'vertical', // ['vertical', 'horizontal']
            includeEventCentral: false,
            countType: 'id', // ['id', 'event'] - applies only when structure = 'horizontal'
        },
    };
}
