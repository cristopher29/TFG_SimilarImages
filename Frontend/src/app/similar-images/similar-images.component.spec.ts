import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimilarImagesComponent } from './similar-images.component';

describe('SimilarImagesComponent', () => {
  let component: SimilarImagesComponent;
  let fixture: ComponentFixture<SimilarImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
