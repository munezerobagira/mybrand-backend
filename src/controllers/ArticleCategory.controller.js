import errorFormatter from "../helpers/errorFormatter";
import Logger from "../helpers/Logger";
import { ArticleService } from "../services";

export default class ArticleCategory {
  static async getCategories(request, response) {
    try {
      const { skip = 0, count = 100, filter = {} } = request.query;
      const result = await ArticleService.getCategories({
        skip,
        count,
        filter,
      });
      return response
        .status(200)
        .json({ status: 200, success: true, categories: result.categories });
    } catch (error) {
      const formattedError = errorFormatter(error);
      Logger.error(formattedError.error.stack);
      return response
        .status(500)
        .json({ status: formattedError.status, error: formattedError.message });
    }
  }

  static async getCategory(request, response) {
    try {
      const { id } = request.params;
      const { articles, skip, count } = request.query;
      const result = await ArticleService.getCategory(id, {
        articles,
        skip,
        count,
      });
      return response
        .status(200)
        .json({ status: 200, success: true, category: result.category });
    } catch (error) {
      const formattedError = errorFormatter(error);
      Logger.error(formattedError.error.stack);
      return response
        .status(formattedError.status)
        .json({ status: formattedError.status, error: formattedError.message });
    }
  }

  static async updateCategory(request, response) {
    try {
      const { id } = request.params;
      const { title, description } = request.body;
      const result = await ArticleService.updateCategory(id, {
        title,
        description,
      });
      return response
        .status(200)
        .json({ status: 200, success: true, category: result.category });
    } catch (error) {
      const formattedError = errorFormatter(error);
      Logger.error(formattedError.error.stack);
      return response
        .status(formattedError.status)
        .json({ status: formattedError.status, error: formattedError.message });
    }
  }
}

