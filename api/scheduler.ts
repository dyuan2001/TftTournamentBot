import Bree from 'bree';
import { DatabaseAPI } from './db.js'

export class Scheduler {
    private static scheduler: Scheduler
    private static bree: Bree 

    private constructor(breeInitArray: Bree.JobOptions[]) {
        Scheduler.bree = new Bree({
            jobs: breeInitArray
        })
    }

    static async getBreeInitArray(): Promise<Bree.JobOptions[]> {
        let breeInitArray: Bree.JobOptions[]
        const snapshotDBArray = await DatabaseAPI.scanAllSnapshots()

        for (const snapshot of snapshotDBArray) {
            for (const job of snapshot.jobs) {
                if (job.endDate.getTime() < Date.now()) continue

                const jobObject = {
                    name: job.name,
                    path: job.path,
                    interval: job.interval,
                    date: job.startDate,
                    closeWorkerAfterMs: job.endDate.getTime() - job.startDate.getTime() + 60000,
                    worker: {
                        workerData: snapshot.id
                    }
                }

                breeInitArray.push(jobObject)
            }
        }

        return breeInitArray
    }

    static async getScheduler(): Promise<Scheduler> {
        if (!Scheduler.scheduler) {
            const breeInitArray = await this.getBreeInitArray()
            Scheduler.scheduler = new Scheduler(breeInitArray)
        }

        return Scheduler.scheduler
    }

    async startAll() {
        await Scheduler.bree.start()
    }

    async start(job: string) {
        await Scheduler.bree.start(job)
    }
}