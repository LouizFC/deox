import { createAction, Action, AnyAction } from './create-action'

export type ActionCreator<T extends AnyAction | string> = T extends AnyAction
  ? {
      (...args: any[]): T
      type: T['type']
      toString(): T['type']
    }
  : (T extends string
      ? {
          (...args: any[]): Action<T>
          type: T
          toString(): T
        }
      : never)

/**
 * Flux standard action creator factory
 * @example
 * createActionCreator('[Todo] truncate');
 * @example
 * createActionCreator(
 *   '[Todo] fetch rejected',
 *   resolve => (error: Error) => resolve(error)
 * );
 * @example
 * createActionCreator(
 *   '[Todo] fetch rejected',
 *   resolve => (error: Error, meta?: { status: number }) => resolve(error, meta)
 * )
 * @example
 * createActionCreator(
 *   '[Todo] add',
 *   resolve => (name: string, completed = false) => resolve({ name, completed })
 * )
 * @example
 * createActionCreator(
 *   '[Todo] add',
 *   resolve => (name: string, completed = false) => resolve({ name, completed }, 'Meta data of all todos')
 * )
 *
 */
export function createActionCreator<
  TType extends string,
  TCallable extends <_T>(...args: any[]) => Action<TType>
>(
  type: TType,
  executor: (
    resolve: <Payload = undefined, Meta = undefined>(
      payload?: Payload,
      meta?: Meta
    ) => Action<TType, Payload, Meta>
  ) => TCallable = resolve => (() => resolve()) as TCallable
) {
  const callable = executor((payload, meta) =>
    createAction(type, payload!, meta!)
  )

  return Object.assign(callable, {
    type,
    toString() {
      return type
    },
  })
}
