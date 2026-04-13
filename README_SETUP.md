myHotel_project

Cleaned project structure for the Atlantic Horizon hotel app.

Current layout

- `atlantic-horizon/` contains the app code
- `atlantic-horizon/client/` contains the Vite React frontend
- `atlantic-horizon/server/` contains the Express backend
- `RoomTypes/` contains room reference images
- `AddPagesToTheProject.txt` contains page-integration notes for contributors

Notes

- Redundant wrapper folders were removed so the repo root now opens directly to the real project files.
- The frontend now lives at `atlantic-horizon/client` instead of `atlantic-horizon/client/client`.
- The backend now lives at `atlantic-horizon/server` instead of `atlantic-horizon/server/server`.

Run the project

Frontend:

```powershell
cd atlantic-horizon/client
npm install
npm run dev
```

Backend:

```powershell
cd atlantic-horizon/server
npm install
npm run dev
```