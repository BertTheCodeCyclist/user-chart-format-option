import { ChangeDetectionStrategy, Component, computed, effect, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TabsModule } from 'primeng/tabs';
import {
  Abbreviation,
  AxisFormat,
  DataLabelFormat,
  DEFAULT_FORMAT_OPTIONS,
  FormatOptions,
  LabelPosition,
  NumberFormat,
  ScaleMode,
  formatValue,
} from './format-options';

@Component({
  selector: 'app-format-settings-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    InputNumberModule,
    InputTextModule,
    ToggleSwitchModule,
    TabsModule,
  ],
  template: `
    <p-dialog
      header="Chart format settings"
      [(visible)]="visible"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      [style]="{ width: '560px' }"
      [closable]="true"
      (onHide)="onCancel()">

      <p-tabs value="axis">
        <p-tablist>
          <p-tab value="axis">Value axis</p-tab>
          <p-tab value="labels">Value labels</p-tab>
        </p-tablist>

        <p-tabpanels>
          <!-- ============== AXIS ============== -->
          <p-tabpanel value="axis">
            <div class="flex flex-col gap-4 pt-2">
              <div class="bg-slate-50 border border-slate-200 rounded-md px-4 py-3">
                <div class="text-xs uppercase text-slate-500 font-semibold mb-1">Preview</div>
                <div
                  class="font-semibold text-slate-800"
                  [style.font-size.px]="draft.axis.fontSize * 1.6">
                  {{ axisPreview() }}
                </div>
              </div>

              <div class="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                <label class="text-sm text-slate-700">Show value axis</label>
                <p-toggleswitch [(ngModel)]="draft.axis.show" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm text-slate-600">Abbreviation</label>
                  <p-select
                    [(ngModel)]="draft.axis.abbreviation"
                    [options]="abbreviationOptions"
                    optionLabel="label" optionValue="value" appendTo="body" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm text-slate-600">Decimal places</label>
                  <p-inputnumber [(ngModel)]="draft.axis.decimals" [min]="0" [max]="4"
                    [showButtons]="true" buttonLayout="horizontal" spinnerMode="horizontal"
                    inputStyleClass="w-full text-center" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm text-slate-600">Prefix</label>
                  <input pInputText [(ngModel)]="draft.axis.prefix" placeholder="e.g. $" maxlength="4" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm text-slate-600">Suffix</label>
                  <input pInputText [(ngModel)]="draft.axis.suffix" placeholder="e.g. %" maxlength="4" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm text-slate-600">Font size (px)</label>
                  <p-inputnumber [(ngModel)]="draft.axis.fontSize" [min]="6" [max]="24"
                    [showButtons]="true" buttonLayout="horizontal" spinnerMode="horizontal"
                    inputStyleClass="w-full text-center" />
                </div>

                <div class="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-3 mt-6">
                  <label class="text-sm text-slate-700">Thousands separator</label>
                  <p-toggleswitch [(ngModel)]="draft.axis.thousandsSeparator" />
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="text-sm text-slate-600">Scale mode</label>
                <p-select
                  [(ngModel)]="draft.axis.scaleMode"
                  [options]="scaleModeOptions"
                  optionLabel="label" optionValue="value" appendTo="body" />
              </div>

              @if (draft.axis.scaleMode === 'custom') {
                <div class="grid grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm text-slate-600">Axis min</label>
                    <p-inputnumber [(ngModel)]="draft.axis.min" placeholder="auto" inputStyleClass="w-full" />
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="text-sm text-slate-600">Axis max</label>
                    <p-inputnumber [(ngModel)]="draft.axis.max" placeholder="auto" inputStyleClass="w-full" />
                  </div>
                </div>
              }
            </div>
          </p-tabpanel>

          <!-- ============== LABELS ============== -->
          <p-tabpanel value="labels">
            <div class="flex flex-col gap-4 pt-2">
              <div class="bg-slate-50 border border-slate-200 rounded-md px-4 py-3">
                <div class="text-xs uppercase text-slate-500 font-semibold mb-1">Preview</div>
                <div
                  class="font-semibold text-slate-800"
                  [style.font-size.px]="draft.dataLabels.fontSize * 1.6">
                  {{ labelPreview() }}
                </div>
              </div>

              <div class="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-3 py-2">
                <label class="text-sm text-slate-700">Show value labels on bars</label>
                <p-toggleswitch [(ngModel)]="draft.dataLabels.show" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="flex flex-col gap-1.5">
                  <label class="text-sm text-slate-600">Position</label>
                  <p-select
                    [(ngModel)]="draft.dataLabels.position"
                    [options]="positionOptions"
                    optionLabel="label" optionValue="value" appendTo="body" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm text-slate-600">Orientation</label>
                  <p-select
                    [(ngModel)]="draft.dataLabels.rotation"
                    [options]="rotationOptions"
                    optionLabel="label" optionValue="value" appendTo="body" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm text-slate-600">Abbreviation</label>
                  <p-select
                    [(ngModel)]="draft.dataLabels.abbreviation"
                    [options]="abbreviationOptions"
                    optionLabel="label" optionValue="value" appendTo="body" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm text-slate-600">Decimal places</label>
                  <p-inputnumber [(ngModel)]="draft.dataLabels.decimals" [min]="0" [max]="4"
                    [showButtons]="true" buttonLayout="horizontal" spinnerMode="horizontal"
                    inputStyleClass="w-full text-center" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm text-slate-600">Prefix</label>
                  <input pInputText [(ngModel)]="draft.dataLabels.prefix" placeholder="e.g. $" maxlength="4" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm text-slate-600">Suffix</label>
                  <input pInputText [(ngModel)]="draft.dataLabels.suffix" placeholder="e.g. %" maxlength="4" />
                </div>

                <div class="flex flex-col gap-1.5">
                  <label class="text-sm text-slate-600">Font size (px)</label>
                  <p-inputnumber [(ngModel)]="draft.dataLabels.fontSize" [min]="6" [max]="24"
                    [showButtons]="true" buttonLayout="horizontal" spinnerMode="horizontal"
                    inputStyleClass="w-full text-center" />
                </div>

                <div class="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-md px-3 mt-6">
                  <label class="text-sm text-slate-700">Thousands separator</label>
                  <p-toggleswitch [(ngModel)]="draft.dataLabels.thousandsSeparator" />
                </div>
              </div>
            </div>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>

      <ng-template pTemplate="footer">
        <div class="flex justify-between items-center w-full">
          <p-button label="Reset to default" severity="secondary" text="true" (onClick)="onReset()" />
          <div class="flex gap-2">
            <p-button label="Cancel" severity="secondary" outlined="true" (onClick)="onCancel()" />
            <p-button label="Save" icon="pi pi-check" (onClick)="onSave()" />
          </div>
        </div>
      </ng-template>
    </p-dialog>
  `,
})
export class FormatSettingsDialog {
  visible = model.required<boolean>();
  options = model.required<FormatOptions>();

  draft: FormatOptions = clone(DEFAULT_FORMAT_OPTIONS);

  abbreviationOptions: { label: string; value: Abbreviation }[] = [
    { label: 'None (1,234)', value: 'none' },
    { label: 'Auto (1.2k / 1.2m)', value: 'auto' },
    { label: 'Thousands (1.2k)', value: 'thousands' },
    { label: 'Millions (1.2m)', value: 'millions' },
  ];

  positionOptions: { label: string; value: LabelPosition }[] = [
    { label: 'Above bar', value: 'above' },
    { label: 'Top (inside)', value: 'top' },
    { label: 'Middle', value: 'middle' },
    { label: 'Bottom (inside)', value: 'bottom' },
    { label: 'Below bar', value: 'below' },
  ];

  scaleModeOptions: { label: string; value: ScaleMode }[] = [
    { label: 'Auto (data extents)', value: 'auto' },
    { label: 'Nice (round numbers)', value: 'nice' },
    { label: 'Begin at zero', value: 'zero' },
    { label: 'Custom (set min / max)', value: 'custom' },
  ];

  rotationOptions: { label: string; value: number }[] = [
    { label: 'Horizontal (0°)', value: 0 },
    { label: 'Diagonal (-45°)', value: -45 },
    { label: 'Vertical (-90°)', value: -90 },
    { label: 'Diagonal (45°)', value: 45 },
    { label: 'Vertical (90°)', value: 90 },
  ];

  private snapshot: FormatOptions | null = null;
  private wasVisible = false;
  private previewTick = signal(0);

  axisPreview = computed(() => {
    this.previewTick();
    return formatValue(1343, this.draft.axis);
  });
  labelPreview = computed(() => {
    this.previewTick();
    return formatValue(1343, this.draft.dataLabels);
  });

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      if (isVisible && !this.wasVisible) {
        this.snapshot = clone(this.options());
        this.draft = clone(this.options());
      }
      this.wasVisible = isVisible;
    });
  }

  ngDoCheck() {
    this.previewTick.update((v) => v + 1);
    if (this.visible()) {
      const next = clone(this.draft);
      if (JSON.stringify(next) !== JSON.stringify(this.options())) {
        this.options.set(next);
      }
    }
  }

  onSave() {
    this.snapshot = null;
    this.visible.set(false);
  }

  onCancel() {
    if (this.snapshot) {
      this.options.set(clone(this.snapshot));
      this.draft = clone(this.snapshot);
      this.snapshot = null;
    }
    this.visible.set(false);
  }

  onReset() {
    this.draft = clone(DEFAULT_FORMAT_OPTIONS);
  }
}

function clone(opts: FormatOptions): FormatOptions {
  return {
    axis: { ...opts.axis },
    dataLabels: { ...opts.dataLabels },
  };
}
