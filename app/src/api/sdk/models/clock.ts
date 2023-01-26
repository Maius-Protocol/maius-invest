import { BN } from "@project-serum/anchor";

export type Slot = BN;
export type Epoch = BN;
export type UnixTimestamp = number;

export class Clock {
  slot: Slot;
  epoch_start_timestamp: UnixTimestamp;
  epoch: Epoch;
  leader_schedule_epoch: Epoch;
  unix_timestamp: UnixTimestamp;

  constructor(
    slot: Slot,
    epoch_start_timestamp: UnixTimestamp,
    epoch: Epoch,
    leader_schedule_epoch: Epoch,
    unix_timestamp: UnixTimestamp
  ) {
    this.slot = slot;
    this.epoch_start_timestamp = epoch_start_timestamp;
    this.epoch = epoch;
    this.leader_schedule_epoch = leader_schedule_epoch;
    this.unix_timestamp = unix_timestamp;
  }
}

export class ClockData {
  slot: BN;
  epoch_start_timestamp: number;
  epoch: BN;
  leader_schedule_epoch: BN;
  unix_timestamp: number;

  constructor(
    slot: BN,
    epoch_start_timestamp: number,
    epoch: BN,
    leader_schedule_epoch: BN,
    unix_timestamp: number
  ) {
    this.slot = slot;
    this.epoch_start_timestamp = epoch_start_timestamp;
    this.epoch = epoch;
    this.leader_schedule_epoch = leader_schedule_epoch;
    this.unix_timestamp = unix_timestamp;
  }

  static from(clock: Clock): ClockData {
    return new ClockData(
      clock.slot,
      clock.epoch_start_timestamp,
      clock.epoch,
      clock.leader_schedule_epoch,
      clock.unix_timestamp
    );
  }

  static to(clock: ClockData): Clock {
    return new Clock(
      clock.slot,
      clock.epoch_start_timestamp,
      clock.epoch,
      clock.leader_schedule_epoch,
      clock.unix_timestamp
    );
  }
}
