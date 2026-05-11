import { Endpoint, EndpointMethod, EndpointAuthType } from 'node-server-engine';
import {
  addHallBookingHandler,
  getAllBookingsHandler,
  getBookingHandler,
  updateBookingHandler,
  deleteBookingHandler,
  getBookingsByMonthHandler
} from './handlers/';
import {
  addBookingValidator,
  updateBookingValidator
} from './hallBookings.validator';

export const addBookingEndpoint = new Endpoint({
  path: '/hall-bookings',
  method: EndpointMethod.POST,
  handler: addHallBookingHandler,
  authType: EndpointAuthType.NONE,
  validator: addBookingValidator
});

export const getBookingsEndpoint = new Endpoint({
  path: '/hall-bookings',
  method: EndpointMethod.GET,
  handler: getAllBookingsHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const getBookingEndpoint = new Endpoint({
  path: '/hall-bookings/:id',
  method: EndpointMethod.GET,
  handler: getBookingHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const updateBookingEndpoint = new Endpoint({
  path: '/hall-bookings/:id',
  method: EndpointMethod.PUT,
  handler: updateBookingHandler,
  authType: EndpointAuthType.NONE,
  validator: updateBookingValidator
});

export const deleteBookingEndpoint = new Endpoint({
  path: '/hall-bookings/:id',
  method: EndpointMethod.DELETE,
  handler: deleteBookingHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});

export const getBookingsByMonthEndpoint = new Endpoint({
  path: '/hall-bookings/by-month',
  method: EndpointMethod.POST,
  handler: getBookingsByMonthHandler,
  authType: EndpointAuthType.NONE,
  validator: {}
});
