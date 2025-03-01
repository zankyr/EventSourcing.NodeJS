import { NextFunction, Request, Response, Router } from 'express';
import { isQuery } from '#core/queries';
import { isNotEmptyString, ValidationError } from '#core/validation';
import { GetShoppingCartDetails, getShoppingCartDetails } from './queryHandler';
import { toWeakETag } from '#core/http/requests';
import { assertUnreachable } from '#core/primitives';

export const route = (router: Router) =>
  router.get(
    '/clients/:clientId/shopping-carts/:shoppingCartId',
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const query = mapRequestToQuery(request);

        if (!isQuery(query)) {
          return next({ status: 400, message: query });
        }

        const result = await getShoppingCartDetails(query);

        if (result.isError) {
          switch (result.error) {
            case 'SHIFT_DOES_NOT_EXIST':
              return next({ status: 404 });
            default:
              assertUnreachable(result.error);
          }
        }

        response.set('ETag', toWeakETag(result.value.revision));
        response.send(result.value);
      } catch (error) {
        next(error);
      }
    }
  );

function mapRequestToQuery(
  request: Request
): GetShoppingCartDetails | ValidationError {
  if (!isNotEmptyString(request.params.shoppingCartId)) {
    return 'MISSING_SHOPPING_CARD_ID';
  }

  return {
    type: 'get-shopping-cart-details',
    data: {
      shoppingCartId: request.params.shoppingCartId,
    },
  };
}
