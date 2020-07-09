import defineEventTypes from './dataManipulation/defineEventTypes';

export default function dataManipulation() {
    this.eventTypes = defineEventTypes.call(this);
}
