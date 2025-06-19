export type TErrorSources = {
	path: string | number;
	message: string;
}[];

export type TGenericError = {
	statusCode: number;
	message: string;
	errorSources: TErrorSources;
};
