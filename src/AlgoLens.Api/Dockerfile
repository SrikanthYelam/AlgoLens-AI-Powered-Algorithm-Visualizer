# Build context is the repo root (see docker-compose.yml) so this stage can see
# AlgoLens.Core, which AlgoLens.Api project-references.
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY src/AlgoLens.Core/AlgoLens.Core.csproj src/AlgoLens.Core/
COPY src/AlgoLens.Api/AlgoLens.Api.csproj src/AlgoLens.Api/
RUN dotnet restore src/AlgoLens.Api/AlgoLens.Api.csproj

COPY src/AlgoLens.Core/ src/AlgoLens.Core/
COPY src/AlgoLens.Api/ src/AlgoLens.Api/
RUN dotnet publish src/AlgoLens.Api/AlgoLens.Api.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app .

# Matches the :5119 the rest of this repo's docs/scripts assume (see CLAUDE.md).
ENV ASPNETCORE_URLS=http://+:5119
EXPOSE 5119

ENTRYPOINT ["dotnet", "AlgoLens.Api.dll"]
