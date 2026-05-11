import {
  EndpointHandler,
  EndpointAuthType,
  reportError
} from 'node-server-engine';
import { MealPlan } from 'db';
import {
  ADD_MEAL_PLAN_ERROR,
  GET_MEAL_PLANS_ERROR,
  GET_MEAL_PLAN_ERROR,
  UPDATE_MEAL_PLAN_ERROR,
  DELETE_MEAL_PLAN_ERROR
} from './meal-plan.const';

type MealPlanBody = {
  serviceDate: Date;
  serviceType: string;
  expectedCrowdCount: number;
  currentStatus: string;
  organizer: string;
  foodItems: object[];
  operationalNotes?: string;
};

export const addMealPlanHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const mealPlan = await MealPlan.create(req.body as MealPlanBody);
    res.status(201).json({ id: mealPlan.id, message: 'Meal Plan created' });
  } catch (error) {
    reportError(error);
    const message =
      error instanceof Error ? error.message : ADD_MEAL_PLAN_ERROR;
    res.status(500).json({ message });
  }
};

export const getMealPlansHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const { page = '1', limit = '10' } = req.query as {
      page?: string;
      limit?: string;
    };

    const { rows, count } = await MealPlan.findAndCountAll({
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: Number(page),
        totalPages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_MEAL_PLANS_ERROR });
  }
};

export const getMealPlanHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findByPk(req.params.id as string);
    if (!mealPlan) {
      res.status(404).json({ message: 'Not found' });
      return;
    }
    res.json(mealPlan);
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: GET_MEAL_PLAN_ERROR });
  }
};

export const updateMealPlanHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    await MealPlan.update(req.body as Partial<MealPlanBody>, {
      where: { id: req.params.id as string }
    });
    const mealPlan = await MealPlan.findByPk(req.params.id as string);
    res.json({ data: mealPlan });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: UPDATE_MEAL_PLAN_ERROR });
  }
};

export const deleteMealPlanHandler: EndpointHandler<
  EndpointAuthType.NONE
> = async (req, res) => {
  try {
    await MealPlan.destroy({ where: { id: req.params.id as string } });
    res.json({ message: 'Deleted' });
  } catch (error) {
    reportError(error);
    res.status(500).json({ message: DELETE_MEAL_PLAN_ERROR });
  }
};
