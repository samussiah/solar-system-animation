import mutateData from './dataManipulation/mutateData';
import nestData from './dataManipulation/nestData';

export default function dataManipulation() {
    mutateData.call(this);
    this.data.nested = nestData.call(this);
    this.metadata.event.forEach((event) => {
        event.data = this.data.nested.filter((d) => d.value.state.event === event.value);
    });
}
