import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  signal,
  viewChild,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DEFAULT_FORMAT_OPTIONS, FormatOptions, formatValue, placementFor } from './format-options';
import { FormatSettingsDialog } from './format-settings-dialog';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip, ChartDataLabels);

const HC_LABELS = ['Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26'];
const HC_DATA = [1343, 1321, 1331, 1338, 1331, 1330, 1320, 1307, 1306, 1296, 1304, 1305, 1304];

@Component({
  selector: 'app-headcount-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, MenuModule, FormatSettingsDialog],
  template: `
    <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
      <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h2 class="text-sm font-semibold text-slate-800">Headcount – Last 12 months</h2>
        <div class="flex items-center gap-1">
          <button
            type="button"
            class="w-8 h-8 inline-flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded"
            (click)="dialogVisible.set(true)"
            title="Chart format settings"
            aria-label="Chart format settings">
            <i class="pi pi-chart-bar text-sm"></i>
          </button>
          <button
            type="button"
            class="w-8 h-8 inline-flex items-center justify-center text-slate-500 hover:bg-slate-100 rounded"
            (click)="menu.toggle($event)"
            aria-label="Chart options">
            <i class="pi pi-ellipsis-h text-sm"></i>
          </button>
          <p-menu #menu [model]="menuItems" [popup]="true" appendTo="body" />
        </div>
      </div>

      <div class="p-4">
        <div class="relative h-[360px]">
          <canvas #chartCanvas></canvas>
        </div>
        <div class="flex items-center gap-2 mt-3">
          <span class="inline-block w-3 h-3 rounded-sm bg-sky-400"></span>
          <span class="text-xs text-slate-600">Headcount</span>
        </div>
      </div>
    </div>

    <app-format-settings-dialog
      [(visible)]="dialogVisible"
      [(options)]="formatOptions" />
  `,
})
export class HeadcountChart implements AfterViewInit {
  private chartCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('chartCanvas');
  private chart?: Chart;

  formatOptions = signal<FormatOptions>({ ...DEFAULT_FORMAT_OPTIONS });
  dialogVisible = signal(false);

  menuItems: MenuItem[] = [
    { label: 'Download as PNG', icon: 'pi pi-download', disabled: true },
    { label: 'View underlying data', icon: 'pi pi-table', disabled: true },
  ];

  constructor() {
    effect(() => {
      const opts = this.formatOptions();
      if (this.chart) {
        this.applyFormatting(opts);
        this.chart.update();
      }
    });
  }

  ngAfterViewInit() {
    const opts = this.formatOptions();
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: HC_LABELS,
        datasets: [
          {
            label: 'Headcount',
            data: HC_DATA,
            backgroundColor: '#7DB9E8',
            borderRadius: 2,
            barPercentage: 0.75,
            categoryPercentage: 0.8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: { top: 24 } },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${formatValue(ctx.parsed.y ?? 0, this.formatOptions().dataLabels)}`,
            },
          },
          datalabels: {
            color: '#475569',
            anchor: () => placementFor(this.formatOptions().dataLabels.position).anchor,
            align: () => placementFor(this.formatOptions().dataLabels.position).align,
            rotation: () => this.formatOptions().dataLabels.rotation,
            font: () => ({ size: this.formatOptions().dataLabels.fontSize, weight: 600 }),
            formatter: (val: number) => formatValue(val, this.formatOptions().dataLabels),
            display: () => this.formatOptions().dataLabels.show,
            clamp: true,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 11 } },
          },
          y: {
            display: opts.axis.show,
            grid: { color: '#eef2f7' },
            ticks: {
              color: '#94a3b8',
              font: { size: opts.axis.fontSize },
              callback: (val) => formatValue(Number(val), this.formatOptions().axis),
            },
            title: { display: true, text: 'Headcount', color: '#94a3b8' },
          },
        },
      },
    };

    this.chart = new Chart(this.chartCanvas().nativeElement, config);
    this.applyFormatting(opts);
    this.chart.update();
  }

  private applyFormatting(opts: FormatOptions) {
    if (!this.chart) return;
    const yScale = this.chart.options.scales!['y'] as any;
    yScale.display = opts.axis.show;
    yScale.ticks.font = { size: opts.axis.fontSize };

    yScale.min = undefined;
    yScale.max = undefined;
    yScale.beginAtZero = false;
    yScale.bounds = 'data';

    switch (opts.axis.scaleMode) {
      case 'nice':
        yScale.bounds = 'ticks';
        break;
      case 'zero':
        yScale.beginAtZero = true;
        break;
      case 'custom':
        yScale.min = opts.axis.min ?? undefined;
        yScale.max = opts.axis.max ?? undefined;
        break;
    }
  }
}
