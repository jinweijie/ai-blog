# Tool Check

Date: 2026-04-30

## Status
- GitHub SSH: OK (authenticated)
- GitHub CLI (gh): Installed, not logged in
- Issue tracking: Use GitHub Issues as the source of task intake
- Vercel deployment: GitHub integration (import repo in Vercel UI)
- Deployment tracking: Run `npm run deploy:status` to map commit to Vercel deploy

## Next Steps
1. Authenticate GitHub CLI:
   - Run: gh auth login
2. Import `jinweijie/ai-blog` into Vercel for deploys
3. Check deployment status:
   - Run: npm run deploy:status
