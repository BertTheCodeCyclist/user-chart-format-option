import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeadcountChart } from './headcount-chart';

@Component({
  selector: 'app-root',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeadcountChart],
  template: `
    <div class="min-h-screen w-[1360px] mx-auto flex bg-slate-100 shadow-sm">
      <!-- ===== Left sidebar ===== -->
      <aside class="w-14 bg-white border-r border-slate-200 flex flex-col items-center py-3 gap-1 shrink-0">
        <div class="w-10 h-10 rounded bg-yellow-300 flex items-center justify-center text-[9px] font-bold text-slate-800 leading-tight text-center mb-3">
          NHS
        </div>
        @for (icon of sidebarIcons; track icon) {
          <button class="w-10 h-10 rounded flex items-center justify-center text-slate-500 hover:bg-slate-100"
                  [class.bg-yellow-200]="icon === 'th-large'"
                  [class.text-slate-800]="icon === 'th-large'">
            <i class="pi pi-{{icon}} text-base"></i>
          </button>
        }
        <div class="flex-1"></div>
        <button class="w-10 h-10 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100">
          <i class="pi pi-question-circle text-base"></i>
        </button>
        <button class="w-10 h-10 rounded flex items-center justify-center text-slate-400 hover:bg-slate-100">
          <i class="pi pi-cog text-base"></i>
        </button>
        <div class="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-semibold mt-1">
          AA
        </div>
      </aside>

      <!-- ===== Main content ===== -->
      <main class="flex-1 px-8 py-5">
        <!-- Header row -->
        <div class="flex items-center justify-between mb-5">
          <h1 class="text-xl font-semibold text-slate-800">My dashboard</h1>
          <div class="flex items-center gap-2">
            @for (icon of headerIcons; track icon) {
              <button class="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50">
                <i class="pi pi-{{icon}} text-sm"></i>
              </button>
            }
          </div>
        </div>

        <!-- Organisation metrics row -->
        <section class="bg-white border border-slate-200 rounded-lg shadow-sm p-4 mb-5 relative">
          <h2 class="text-sm font-semibold text-slate-800 mb-3">Organisation metrics</h2>
          <button class="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <i class="pi pi-ellipsis-h text-xs"></i>
          </button>

          <div class="grid grid-cols-4 gap-4">
            <!-- Donut card -->
            <div class="border border-slate-200 rounded-md p-3 flex items-center gap-3">
              <div class="flex-1">
                <div class="text-xs text-slate-400 italic">No metric groups found</div>
                <ul class="text-[11px] mt-2 space-y-1">
                  <li class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-red-500 rounded-sm"></span>Critical</li>
                  <li class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-orange-400 rounded-sm"></span>Warning</li>
                  <li class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-green-500 rounded-sm"></span>On Track</li>
                  <li class="flex items-center gap-1.5"><span class="w-2.5 h-2.5 bg-sky-200 rounded-sm"></span>Unbanded</li>
                </ul>
              </div>
              <svg viewBox="0 0 36 36" class="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" stroke-width="6" stroke-dasharray="22 88" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#fb923c" stroke-width="6" stroke-dasharray="18 88" stroke-dashoffset="-22" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#22c55e" stroke-width="6" stroke-dasharray="32 88" stroke-dashoffset="-40" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#bae6fd" stroke-width="6" stroke-dasharray="16 88" stroke-dashoffset="-72" />
              </svg>
            </div>

            <!-- Metric tiles -->
            @for (m of metrics; track m.label) {
              <div class="border border-slate-200 rounded-md p-3 flex items-center gap-3">
                <div class="flex-1">
                  <div class="text-sm font-semibold text-slate-700">{{ m.label }}</div>
                  <div class="text-3xl font-bold text-slate-800 leading-tight">0</div>
                  <div class="text-[10px] text-slate-500 flex items-center gap-1 mt-1">
                    <i class="pi pi-arrow-right text-[8px] text-orange-500"></i>
                    {{ m.label }} levels have remained the same since last month
                  </div>
                </div>
                <div class="w-14 h-14 rounded-md flex items-center justify-center" [style.background]="m.bg">
                  <i class="pi {{m.icon}} text-2xl" [style.color]="m.iconColor"></i>
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Chart row: real headcount + mock referrals -->
        <section class="grid grid-cols-2 gap-5 mb-5">
          <app-headcount-chart />

          <!-- Mock test referrals chart -->
          <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h2 class="text-sm font-semibold text-slate-800">Test referrals LT</h2>
              <button class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <i class="pi pi-ellipsis-h text-xs"></i>
              </button>
            </div>
            <div class="p-4 h-[360px] flex flex-col justify-end">
              <div class="flex-1 flex items-end gap-12 px-8 pb-3 border-b border-l border-slate-200">
                <div class="flex items-end gap-2">
                  <div class="w-6 bg-sky-400" style="height: 80px"></div>
                </div>
                <div class="flex items-end gap-2">
                  <div class="w-6 bg-orange-400" style="height: 230px"></div>
                </div>
                <div class="flex items-end gap-2">
                  <div class="w-6 bg-green-400" style="height: 50px"></div>
                </div>
              </div>
              <div class="flex justify-around px-8 mt-2 text-[10px] text-slate-500">
                <span>2024</span><span>2025</span><span>2026</span>
              </div>
              <div class="flex items-center justify-center gap-3 mt-3 text-[10px] text-slate-600">
                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-sky-400"></span>2024</span>
                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-orange-400"></span>2025</span>
                <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 bg-green-400"></span>2026</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Mock pie chart -->
        <section class="bg-white border border-slate-200 rounded-lg shadow-sm p-4 relative">
          <h2 class="text-sm font-semibold text-slate-800 mb-3">LT Testing - Delete</h2>
          <button class="absolute top-3 right-3 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <i class="pi pi-ellipsis-h text-xs"></i>
          </button>
          <div class="flex items-center justify-center py-4">
            <svg viewBox="0 0 200 200" class="w-56 h-56">
              <circle cx="100" cy="100" r="80" fill="#f59e0b" />
              <path d="M100 100 L100 20 A80 80 0 0 1 175 130 Z" fill="#ec4899" />
              <path d="M100 100 L175 130 A80 80 0 0 1 145 175 Z" fill="#a855f7" />
              <path d="M100 100 L145 175 A80 80 0 0 1 60 175 Z" fill="#ef4444" />
              <path d="M100 100 L60 175 A80 80 0 0 1 25 110 Z" fill="#22c55e" />
              <path d="M100 100 L25 110 A80 80 0 0 1 35 50 Z" fill="#84cc16" />
              <path d="M100 100 L35 50 A80 80 0 0 1 100 20 Z" fill="#3b82f6" />
            </svg>
          </div>
          <div class="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-slate-600">
            @for (slice of pieLegend; track slice.label) {
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5" [style.background]="slice.color"></span>
                {{ slice.label }}
              </span>
            }
          </div>
        </section>
      </main>
    </div>
  `,
})
export class App {
  sidebarIcons = ['th-large', 'lightbulb', 'inbox', 'folder-open', 'comment', 'megaphone', 'list', 'book', 'search'];
  headerIcons = ['pencil', 'filter', 'sign-out'];

  metrics = [
    { label: 'Critical', icon: 'pi-exclamation-circle', iconColor: '#ef4444', bg: '#fee2e2' },
    { label: 'Warning',  icon: 'pi-exclamation-triangle', iconColor: '#f59e0b', bg: '#fef3c7' },
    { label: 'On Track', icon: 'pi-check-circle', iconColor: '#22c55e', bg: '#dcfce7' },
  ];

  pieLegend = [
    { label: 'Bank Staff not fulfilled minimum work requirement', color: '#f59e0b' },
    { label: 'Dismissal - Capability', color: '#ec4899' },
    { label: 'Dismissal - Some Other Substantial Reason', color: '#a855f7' },
    { label: 'End of Fixed Term Contract', color: '#ef4444' },
    { label: 'End of Fixed Term Contract - End of Work Requirement', color: '#22c55e' },
    { label: 'Voluntary Resignation - Health', color: '#84cc16' },
    { label: 'Voluntary Resignation - Promotion', color: '#3b82f6' },
  ];
}
