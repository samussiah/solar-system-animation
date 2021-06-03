export default function freqTable() {
    return {
        freqTable: {
            display: true,
            title: null,
            columns: ['label', 'id', 'event'],
            header: true,
            bars: true,
            structure: 'vertical', // ['vertical', 'horizontal']
            includeEventCentral: false,
            displayIndividuals: true,
            countType: 'id', // ['id', 'event'] - applies only when structure = 'horizontal'
        },
    };
}
