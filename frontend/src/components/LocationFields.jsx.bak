import React from 'react';
import { Label } from './ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { STATES, districtsOf } from '../lib/indianLocations';

export default function LocationFields({ state, district, onStateChange, onDistrictChange }) {
  const districts = districtsOf(state);
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <Label className="text-sm">State</Label>
        <Select value={state} onValueChange={onStateChange}>
          <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
          <SelectContent>
            {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-sm">District</Label>
        <Select value={district} onValueChange={onDistrictChange} disabled={!state || districts.length === 0}>
          <SelectTrigger><SelectValue placeholder={districts.length ? "Select district" : "No data yet"} /></SelectTrigger>
          <SelectContent>
            {districts.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
