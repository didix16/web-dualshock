export default class Emitter {
    private events;
    $on(event: string, callback: (...args: any[]) => void): this;
    $off(event: string, callback: (...args: any[]) => void): this;
    $once(event: string, callback: (...args: any[]) => void): this;
    $emit(event: string, ...data: any[]): void;
}
