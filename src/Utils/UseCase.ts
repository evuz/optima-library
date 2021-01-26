import { Observable } from 'rxjs'

export interface ObservableUseCase<T> {
  execute(...args: any[]): Observable<T>;
}

export interface ExecutableUseCase<T> {
  execute(...args: any[]): Promise<T>;
}

export type UseCase<T> = ExecutableUseCase<T> | ObservableUseCase<T>;
