import type { Request, Response } from "express";
import { Sweet } from "../models/sweet.model.js";
import { searchCriteriaSchema } from "../schema/sweet.schema.js";
import type { SweetService } from "../services/sweet.service.js";
import { handleCommonErrors } from "./utils.js";

export class SweetController {
  constructor(private sweetService: SweetService) {}

  getAllSweets(req: Request, res: Response) {
    const sweets = this.sweetService.getAllSweets();
    res.status(200).json({ data: sweets });
  }

  getSweetById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const sweet = this.sweetService.getSweetById(Number(id));
      if (!sweet) {
        return res.status(404).json({ error: "Sweet not found" });
      }
      res.status(200).json({ data: sweet });
    } catch (error) {
      handleCommonErrors(error, res);
    }
  }

  createSweet(req: Request, res: Response) {
    const sweetData = req.body;
    const randomId = Math.floor(Math.random() * 1000000);
    try {
      const sweet = new Sweet(
        randomId,
        sweetData.name,
        sweetData.category,
        sweetData.price,
        sweetData.quantity,
      );
      const newSweet = this.sweetService.createSweet(sweet);
      res.status(201).json({ data: newSweet });
    } catch (error) {
      handleCommonErrors(error, res);
    }
  }

  deleteSweet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deleted = this.sweetService.deleteSweet(Number(id));
      if (!deleted) {
        return res.status(404).json({ error: "Sweet not found" });
      }
      res.status(204).json({});
    } catch (error) {
      handleCommonErrors(error, res);
    }
  }

  purchaseSweet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const result = this.sweetService.purchaseSweet(Number(id), quantity);
      if (!result) {
        return res
          .status(404)
          .json({ error: "Sweet not found or insufficient quantity" });
      }
      res.status(200).json({ data: result });
    } catch (error) {
      handleCommonErrors(error, res);
    }
  }

  restockSweet(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const result = this.sweetService.restockSweet(Number(id), quantity);
      if (!result) {
        return res
          .status(404)
          .json({ error: "Sweet not found or insufficient quantity" });
      }
      res.status(200).json({ data: result });
    } catch (error) {
      handleCommonErrors(error, res);
    }
  }

  searchSweets(req: Request, res: Response) {
    const { name, category, minPrice, maxPrice } = req.query;

    if (!name && !category && !minPrice && !maxPrice) {
      return res
        .status(400)
        .json({ error: "At least one search parameter is required" });
    }

    const searchParams = {
      name: name as string,
      category: category as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    };
    const validSearchParams = searchCriteriaSchema.safeParse(searchParams);
    if (!validSearchParams.success) {
      return res
        .status(400)
        .json({ error: "minPrice cannot be greater than maxPrice" });
    }

    const results = this.sweetService.searchSweets(searchParams);
    res.status(200).json({ data: results });
  }
}
