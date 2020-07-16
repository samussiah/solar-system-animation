import mutateData from './dataManipulation/mutateData';
import nestData from './dataManipulation/nestData';

export default function dataManipulation() {
    mutateData.call(this);
    this.data.nested = nestData.call(this);
}
