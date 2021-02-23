import mutateData from './data/mutateData';
import nestData from './data/nestData';

export default function data() {
    mutateData.call(this);
    this.data.nested = nestData.call(this, this.data);
    this.metadata.event.forEach((event) => {
        event.data = this.data.nested.filter((d) => d.value.state.event === event.key);
    });
}
