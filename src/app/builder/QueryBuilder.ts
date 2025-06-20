import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
	public modelQuery: Query<T[], T>;
	public query: Record<string, unknown>;

	constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
		this.modelQuery = modelQuery;
		this.query = query;
	}

	// Searching Method
	search(searchableFields: string[]) {
		const searchTerm = this?.query?.searchTerm as string;
		if (searchTerm) {
			this.modelQuery = this?.modelQuery?.find({
				$or: searchableFields?.map(
					(field) =>
						({
							[field]: { $regex: searchTerm, $options: 'i' },
						}) as FilterQuery<T>,
				),
			});
		}
		return this;
	}

	// Filter Method
	filter() {
		const queryObj = { ...this.query };
		const excludedFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
		excludedFields.forEach((el) => delete queryObj[el]);

		this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

		return this;
	}

	// Sorting Method
	sort() {
		const sort: string =
			(this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';
		this.modelQuery = this.modelQuery.sort(sort);
		return this;
	}

	// Pagination Method
	paginate() {
		const page = Number(this.query.page) || 1;
		const limit = Number(this.query.limit) || 1;
		const skip = Number((page - 1) * limit);

		this.modelQuery = this.modelQuery.skip(skip).limit(limit);

		return this;
	}

	fieldLimiting() {
		const fields =
			((this?.query?.fields as string)?.split(',')?.join(' ') as string) ||
			'-__v';

		this.modelQuery = this?.modelQuery?.select(fields);

		return this;
	}
}

export default QueryBuilder;
