import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Firmadorv1Component } from './firmadorv1.component';

describe('Firmadorv1Component', () => {
  let component: Firmadorv1Component;
  let fixture: ComponentFixture<Firmadorv1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Firmadorv1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Firmadorv1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
